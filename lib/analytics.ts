import { getDatabase, OceanScores } from './database';

// Tipos para resultados analíticos
export interface OceanEvolution {
  date: string;
  openness: number | null;
  conscientiousness: number | null;
  extraversion: number | null;
  agreeableness: number | null;
  neuroticism: number | null;
}

export interface ThemeFrequency {
  name: string;
  frequency: number;
  avg_relevance: number;
}

export interface ThemeCorrelation {
  theme: string;
  avg_neuroticism: number | null;
  avg_openness: number | null;
  avg_conscientiousness: number | null;
  avg_extraversion: number | null;
  avg_agreeableness: number | null;
}

export interface PsychologicalPattern {
  element_name: string;
  element_type: string;
  occurrences: number;
  avg_confidence: number;
}

export interface InsightsSummary {
  total_sessions: number;
  most_frequent_themes: ThemeFrequency[];
  dominant_psychological_patterns: PsychologicalPattern[];
  ocean_trends: {
    trait: string;
    current_avg: number;
    previous_avg: number;
    change: number;
  }[];
  recent_patterns: string[];
}

/**
 * Obtém evolução dos traços OCEAN ao longo do tempo
 */
export function getOceanEvolution(days: number = 30): OceanEvolution[] {
  const db = getDatabase();
  
  const results = db.prepare(`
    SELECT 
      DATE(s.created_at) as date,
      AVG(o.openness) as openness,
      AVG(o.conscientiousness) as conscientiousness,
      AVG(o.extraversion) as extraversion,
      AVG(o.agreeableness) as agreeableness,
      AVG(o.neuroticism) as neuroticism
    FROM sessions s
    JOIN ocean_scores o ON s.id = o.session_id
    WHERE s.created_at >= datetime('now', '-' || ? || ' days')
    GROUP BY DATE(s.created_at)
    ORDER BY date
  `).all(days) as OceanEvolution[];
  
  return results;
}

/**
 * Obtém temas mais frequentes
 */
export function getTopThemes(limit: number = 10): ThemeFrequency[] {
  const db = getDatabase();
  
  const results = db.prepare(`
    SELECT 
      t.name,
      COUNT(*) as frequency,
      AVG(st.relevance) as avg_relevance
    FROM themes t
    JOIN session_themes st ON t.id = st.theme_id
    GROUP BY t.id
    ORDER BY frequency DESC
    LIMIT ?
  `).all(limit) as ThemeFrequency[];
  
  return results;
}

/**
 * Correlação entre temas e estados emocionais (OCEAN)
 */
export function getThemeCorrelations(themeNames?: string[]): ThemeCorrelation[] {
  const db = getDatabase();
  
  let query = `
    SELECT 
      t.name as theme,
      AVG(o.neuroticism) as avg_neuroticism,
      AVG(o.openness) as avg_openness,
      AVG(o.conscientiousness) as avg_conscientiousness,
      AVG(o.extraversion) as avg_extraversion,
      AVG(o.agreeableness) as avg_agreeableness
    FROM themes t
    JOIN session_themes st ON t.id = st.theme_id
    JOIN ocean_scores o ON st.session_id = o.session_id
  `;
  
  if (themeNames && themeNames.length > 0) {
    const placeholders = themeNames.map(() => '?').join(',');
    query += ` WHERE t.name IN (${placeholders})`;
  }
  
  query += ` GROUP BY t.name ORDER BY COUNT(*) DESC`;
  
  const results = themeNames && themeNames.length > 0
    ? db.prepare(query).all(...themeNames)
    : db.prepare(query).all();
  
  return results as ThemeCorrelation[];
}

/**
 * Padrões psicológicos dominantes
 */
export function getPsychologicalPatterns(
  elementType?: string,
  limit: number = 10
): PsychologicalPattern[] {
  const db = getDatabase();
  
  let query = `
    SELECT 
      element_name,
      element_type,
      COUNT(*) as occurrences,
      AVG(confidence) as avg_confidence
    FROM psychological_elements
  `;
  
  if (elementType) {
    query += ` WHERE element_type = ?`;
  }
  
  query += `
    GROUP BY element_name, element_type
    ORDER BY occurrences DESC
    LIMIT ?
  `;
  
  const results = elementType
    ? db.prepare(query).all(elementType, limit)
    : db.prepare(query).all(limit);
  
  return results as PsychologicalPattern[];
}

/**
 * Análise de tendências OCEAN (comparação período atual vs. anterior)
 */
export function getOceanTrends(days: number = 30) {
  const db = getDatabase();
  
  // Média do período atual
  const current = db.prepare(`
    SELECT 
      AVG(o.openness) as openness,
      AVG(o.conscientiousness) as conscientiousness,
      AVG(o.extraversion) as extraversion,
      AVG(o.agreeableness) as agreeableness,
      AVG(o.neuroticism) as neuroticism
    FROM sessions s
    JOIN ocean_scores o ON s.id = o.session_id
    WHERE s.created_at >= datetime('now', '-' || ? || ' days')
  `).get(days) as OceanScores;
  
  // Média do período anterior (mesmo número de dias)
  const previous = db.prepare(`
    SELECT 
      AVG(o.openness) as openness,
      AVG(o.conscientiousness) as conscientiousness,
      AVG(o.extraversion) as extraversion,
      AVG(o.agreeableness) as agreeableness,
      AVG(o.neuroticism) as neuroticism
    FROM sessions s
    JOIN ocean_scores o ON s.id = o.session_id
    WHERE s.created_at >= datetime('now', '-' || ? || ' days')
      AND s.created_at < datetime('now', '-' || ? || ' days')
  `).get(days * 2, days) as OceanScores;
  
  const traits = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism'
  ] as const;
  
  return traits.map(trait => ({
    trait,
    current_avg: current[trait] || 0,
    previous_avg: previous[trait] || 0,
    change: (current[trait] || 0) - (previous[trait] || 0)
  }));
}

/**
 * Gera insights automáticos baseados nos dados
 */
export function generateInsights(days: number = 30): InsightsSummary {
  const db = getDatabase();
  
  // Total de sessões
  const totalResult = db.prepare(`
    SELECT COUNT(*) as count 
    FROM sessions 
    WHERE created_at >= datetime('now', '-' || ? || ' days')
  `).get(days) as { count: number };
  
  // Temas mais frequentes
  const topThemes = getTopThemes(5);
  
  // Padrões psicológicos dominantes
  const dominantPatterns = getPsychologicalPatterns(undefined, 5);
  
  // Tendências OCEAN
  const oceanTrends = getOceanTrends(days);
  
  // Padrões recentes (últimos 7 dias)
  const recentPatterns: string[] = [];
  
  // Verificar se há aumento em neuroticism
  const highNeuroticism = oceanTrends.find(t => t.trait === 'neuroticism');
  if (highNeuroticism && highNeuroticism.change > 1) {
    recentPatterns.push(
      `Seu score de Neuroticism aumentou ${highNeuroticism.change.toFixed(1)} pontos no período.`
    );
  }
  
  // Verificar temas recorrentes
  if (topThemes.length > 0 && topThemes[0].frequency > totalResult.count * 0.5) {
    recentPatterns.push(
      `Você menciona "${topThemes[0].name}" em ${((topThemes[0].frequency / totalResult.count) * 100).toFixed(0)}% das suas reflexões.`
    );
  }
  
  // Verificar padrões psicológicos recorrentes
  if (dominantPatterns.length > 0 && dominantPatterns[0].occurrences > 3) {
    recentPatterns.push(
      `Padrão detectado: "${dominantPatterns[0].element_name}" aparece frequentemente (${dominantPatterns[0].occurrences}x).`
    );
  }
  
  return {
    total_sessions: totalResult.count,
    most_frequent_themes: topThemes,
    dominant_psychological_patterns: dominantPatterns,
    ocean_trends: oceanTrends,
    recent_patterns: recentPatterns
  };
}

/**
 * Busca sessões por período de tempo
 */
export function getSessionsByDateRange(startDate: string, endDate: string) {
  const db = getDatabase();
  
  return db.prepare(`
    SELECT s.*, 
           o.openness, o.conscientiousness, o.extraversion, o.agreeableness, o.neuroticism
    FROM sessions s
    LEFT JOIN ocean_scores o ON s.id = o.session_id
    WHERE DATE(s.created_at) BETWEEN ? AND ?
    ORDER BY s.created_at DESC
  `).all(startDate, endDate);
}

/**
 * Estatísticas gerais
 */
export function getGeneralStats() {
  const db = getDatabase();
  
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total_sessions,
      AVG(audio_duration_seconds) as avg_duration,
      SUM(audio_duration_seconds) as total_duration,
      MIN(created_at) as first_session,
      MAX(created_at) as last_session
    FROM sessions
  `).get() as {
    total_sessions: number;
    avg_duration: number;
    total_duration: number;
    first_session: string;
    last_session: string;
  };
  
  const themeCount = db.prepare(`
    SELECT COUNT(*) as count FROM themes
  `).get() as { count: number };
  
  return {
    ...stats,
    unique_themes: themeCount.count
  };
}
