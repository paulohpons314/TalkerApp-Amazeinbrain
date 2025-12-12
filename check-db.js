const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'talkerapp.db');
console.log('Caminho do banco:', dbPath);

try {
  const db = new Database(dbPath, { readonly: true });

  // Contar sessões
  const countResult = db.prepare('SELECT COUNT(*) as count FROM sessions').get();
  console.log('\n=== BANCO ORIGINAL ===');
  console.log('Total de sessões:', countResult.count);

  if (countResult.count > 0) {
    // Listar últimas 5 sessões
    const sessions = db.prepare(`
      SELECT id, created_at,
             substr(transcription, 1, 50) as transcription_preview,
             audio_duration_seconds
      FROM sessions
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    console.log('\nÚltimas 5 sessões:');
    sessions.forEach(s => {
      console.log(`  ID: ${s.id} | Data: ${s.created_at} | Preview: "${s.transcription_preview}..."`);
    });

    // Verificar OCEAN scores
    const oceanCount = db.prepare('SELECT COUNT(*) as count FROM ocean_scores').get();
    console.log('\nTotal de OCEAN scores:', oceanCount.count);

    // Verificar temas
    const themesCount = db.prepare('SELECT COUNT(*) as count FROM themes').get();
    console.log('Total de temas:', themesCount.count);
  }

  db.close();
} catch (error) {
  console.error('Erro ao acessar banco de dados:', error.message);
  process.exit(1);
}
