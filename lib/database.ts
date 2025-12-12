import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'talkerapp.db');

// Garantir que o diretório data existe
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL'); // Write-Ahead Logging para melhor performance
    db.pragma('foreign_keys = ON'); // Habilitar foreign keys
    initializeSchema(db);
    setupDatabaseMaintenance(db);
  }
  return db;
}

// Configurar manutenção automática do banco de dados
function setupDatabaseMaintenance(database: Database.Database) {
  // Checkpoint automático a cada 5 minutos para consolidar WAL
  const CHECKPOINT_INTERVAL = 5 * 60 * 1000; // 5 minutos

  const checkpointTimer = setInterval(() => {
    try {
      // PASSIVE: não bloqueia leituras/escritas, apenas consolida quando possível
      database.pragma('wal_checkpoint(PASSIVE)');
      console.log('[DB] WAL checkpoint executado com sucesso');
    } catch (error) {
      console.error('[DB] Erro ao executar checkpoint:', error);
    }
  }, CHECKPOINT_INTERVAL);

  // Garantir que o timer seja limpo ao encerrar
  process.on('beforeExit', () => {
    clearInterval(checkpointTimer);
  });
}

function initializeSchema(database: Database.Database) {
  // Criar tabelas se não existirem
  database.exec(`
    -- Tabela principal: Sessões de gravação
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      audio_duration_seconds INTEGER,
      transcription TEXT NOT NULL,
      processed_text TEXT NOT NULL,
      analysis TEXT,
      user_notes TEXT
    );

    -- Tabela de análises OCEAN por sessão
    CREATE TABLE IF NOT EXISTS ocean_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      openness INTEGER CHECK(openness BETWEEN 1 AND 10),
      conscientiousness INTEGER CHECK(conscientiousness BETWEEN 1 AND 10),
      extraversion INTEGER CHECK(extraversion BETWEEN 1 AND 10),
      agreeableness INTEGER CHECK(agreeableness BETWEEN 1 AND 10),
      neuroticism INTEGER CHECK(neuroticism BETWEEN 1 AND 10),
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );

    -- Tabela de temas/tags extraídos
    CREATE TABLE IF NOT EXISTS themes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      category TEXT
    );

    -- Relacionamento N:N entre sessões e temas
    CREATE TABLE IF NOT EXISTS session_themes (
      session_id INTEGER NOT NULL,
      theme_id INTEGER NOT NULL,
      relevance REAL DEFAULT 1.0,
      PRIMARY KEY (session_id, theme_id),
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
    );

    -- Tabela de elementos psicológicos detectados
    CREATE TABLE IF NOT EXISTS psychological_elements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      element_type TEXT NOT NULL,
      element_name TEXT NOT NULL,
      evidence TEXT,
      confidence REAL,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );

    -- Índices para queries rápidas
    CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(created_at);
    CREATE INDEX IF NOT EXISTS idx_themes_name ON themes(name);
    CREATE INDEX IF NOT EXISTS idx_psych_type ON psychological_elements(element_type);
    CREATE INDEX IF NOT EXISTS idx_ocean_session ON ocean_scores(session_id);

    -- Full-Text Search para busca semântica
    CREATE VIRTUAL TABLE IF NOT EXISTS sessions_fts USING fts5(
      transcription, 
      processed_text,
      content='sessions',
      content_rowid='id'
    );

    -- Triggers para manter FTS sincronizado
    CREATE TRIGGER IF NOT EXISTS sessions_ai AFTER INSERT ON sessions BEGIN
      INSERT INTO sessions_fts(rowid, transcription, processed_text)
      VALUES (new.id, new.transcription, new.processed_text);
    END;

    CREATE TRIGGER IF NOT EXISTS sessions_ad AFTER DELETE ON sessions BEGIN
      INSERT INTO sessions_fts(sessions_fts, rowid, transcription, processed_text)
      VALUES('delete', old.id, old.transcription, old.processed_text);
    END;

    CREATE TRIGGER IF NOT EXISTS sessions_au AFTER UPDATE ON sessions BEGIN
      INSERT INTO sessions_fts(sessions_fts, rowid, transcription, processed_text)
      VALUES('delete', old.id, old.transcription, old.processed_text);
      INSERT INTO sessions_fts(rowid, transcription, processed_text)
      VALUES (new.id, new.transcription, new.processed_text);
    END;
  `);
}

// Tipos TypeScript
export interface Session {
  id?: number;
  created_at?: string;
  audio_duration_seconds?: number;
  transcription: string;
  processed_text: string;
  analysis?: string;
  user_notes?: string;
}

export interface OceanScores {
  openness?: number;
  conscientiousness?: number;
  extraversion?: number;
  agreeableness?: number;
  neuroticism?: number;
}

export interface Theme {
  id?: number;
  name: string;
  category?: string;
}

export interface PsychologicalElement {
  element_type: string;
  element_name: string;
  evidence?: string;
  confidence?: number;
}

export interface SessionWithDetails extends Session {
  ocean_scores?: OceanScores;
  themes?: Theme[];
  psychological_elements?: PsychologicalElement[];
}

// Funções CRUD

export function createSession(
  session: Session,
  oceanScores?: OceanScores,
  themes?: string[],
  psychologicalElements?: PsychologicalElement[]
): number {
  const db = getDatabase();
  
  // Usar transação para garantir consistência
  const transaction = db.transaction(() => {
    // 1. Inserir sessão
    const insertSession = db.prepare(`
      INSERT INTO sessions (audio_duration_seconds, transcription, processed_text, analysis, user_notes)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = insertSession.run(
      session.audio_duration_seconds || null,
      session.transcription,
      session.processed_text,
      session.analysis || null,
      session.user_notes || null
    );
    
    const sessionId = result.lastInsertRowid as number;

    // 2. Inserir OCEAN scores se fornecidos
    if (oceanScores && Object.keys(oceanScores).length > 0) {
      const insertOcean = db.prepare(`
        INSERT INTO ocean_scores (session_id, openness, conscientiousness, extraversion, agreeableness, neuroticism)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      insertOcean.run(
        sessionId,
        oceanScores.openness || null,
        oceanScores.conscientiousness || null,
        oceanScores.extraversion || null,
        oceanScores.agreeableness || null,
        oceanScores.neuroticism || null
      );
    }

    // 3. Processar temas
    if (themes && themes.length > 0) {
      const insertTheme = db.prepare(`
        INSERT OR IGNORE INTO themes (name) VALUES (?)
      `);
      
      const getThemeId = db.prepare(`
        SELECT id FROM themes WHERE name = ?
      `);
      
      const insertSessionTheme = db.prepare(`
        INSERT INTO session_themes (session_id, theme_id) VALUES (?, ?)
      `);
      
      themes.forEach(themeName => {
        insertTheme.run(themeName);
        const theme = getThemeId.get(themeName) as { id: number };
        insertSessionTheme.run(sessionId, theme.id);
      });
    }

    // 4. Inserir elementos psicológicos
    if (psychologicalElements && psychologicalElements.length > 0) {
      const insertElement = db.prepare(`
        INSERT INTO psychological_elements (session_id, element_type, element_name, evidence, confidence)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      psychologicalElements.forEach(element => {
        insertElement.run(
          sessionId,
          element.element_type,
          element.element_name,
          element.evidence || null,
          element.confidence || null
        );
      });
    }

    return sessionId;
  });

  return transaction();
}

export function getSession(id: number): SessionWithDetails | null {
  const db = getDatabase();
  
  const session = db.prepare(`
    SELECT * FROM sessions WHERE id = ?
  `).get(id) as Session | undefined;
  
  if (!session) return null;

  // Buscar OCEAN scores
  const oceanScores = db.prepare(`
    SELECT openness, conscientiousness, extraversion, agreeableness, neuroticism
    FROM ocean_scores WHERE session_id = ?
  `).get(id) as OceanScores | undefined;

  // Buscar temas
  const themes = db.prepare(`
    SELECT t.id, t.name, t.category
    FROM themes t
    JOIN session_themes st ON t.id = st.theme_id
    WHERE st.session_id = ?
  `).all(id) as Theme[];

  // Buscar elementos psicológicos
  const psychologicalElements = db.prepare(`
    SELECT element_type, element_name, evidence, confidence
    FROM psychological_elements
    WHERE session_id = ?
  `).all(id) as PsychologicalElement[];

  return {
    ...session,
    ocean_scores: oceanScores,
    themes,
    psychological_elements: psychologicalElements
  };
}

export function getAllSessions(limit: number = 50, offset: number = 0): Session[] {
  const db = getDatabase();
  
  return db.prepare(`
    SELECT * FROM sessions
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as Session[];
}

export function searchSessions(query: string, limit: number = 20): Array<Session & { rank: number }> {
  const db = getDatabase();
  
  return db.prepare(`
    SELECT s.*, rank
    FROM sessions_fts
    JOIN sessions s ON sessions_fts.rowid = s.id
    WHERE sessions_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `).all(query, limit) as Array<Session & { rank: number }>;
}

export function updateSessionNotes(id: number, notes: string): void {
  const db = getDatabase();
  
  db.prepare(`
    UPDATE sessions SET user_notes = ? WHERE id = ?
  `).run(notes, id);
}

export function deleteSession(id: number): void {
  const db = getDatabase();
  
  db.prepare(`
    DELETE FROM sessions WHERE id = ?
  `).run(id);
}

export function getSessionCount(): number {
  const db = getDatabase();
  
  const result = db.prepare(`
    SELECT COUNT(*) as count FROM sessions
  `).get() as { count: number };
  
  return result.count;
}

// Graceful shutdown: garantir que dados sejam salvos antes de encerrar
function closeDatabase() {
  if (db) {
    try {
      // Executar checkpoint final para consolidar todo o WAL
      console.log('[DB] Executando checkpoint final antes de fechar...');
      db.pragma('wal_checkpoint(TRUNCATE)');

      // Fechar conexão
      db.close();
      db = null;
      console.log('[DB] Banco de dados fechado com sucesso');
    } catch (error) {
      console.error('[DB] Erro ao fechar banco de dados:', error);
    }
  }
}

// Capturar múltiplos sinais de encerramento
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
  console.log('\n[DB] Recebido SIGINT, encerrando gracefully...');
  closeDatabase();
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log('\n[DB] Recebido SIGTERM, encerrando gracefully...');
  closeDatabase();
  process.exit(0);
});
process.on('uncaughtException', (error) => {
  console.error('[DB] Exceção não capturada:', error);
  closeDatabase();
  process.exit(1);
});
