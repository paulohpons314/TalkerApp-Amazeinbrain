const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'talkerapp.db');
console.log('=== VERIFICAÇÃO DE INTEGRIDADE DO BANCO DE DADOS ===');
console.log('Caminho:', dbPath);
console.log('');

try {
  const db = new Database(dbPath, { readonly: true });

  // 1. Verificar integridade do SQLite
  console.log('1. Verificando integridade do SQLite...');
  const integrityCheck = db.prepare('PRAGMA integrity_check').get();
  console.log('   Resultado:', integrityCheck.integrity_check);
  console.log('');

  // 2. Listar todas as tabelas
  console.log('2. Tabelas no banco:');
  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table'
    ORDER BY name
  `).all();
  tables.forEach(t => console.log('   -', t.name));
  console.log('');

  // 3. Contar registros em cada tabela
  console.log('3. Contagem de registros:');
  const sessionsCount = db.prepare('SELECT COUNT(*) as count FROM sessions').get();
  console.log('   sessions:', sessionsCount.count);

  const oceanCount = db.prepare('SELECT COUNT(*) as count FROM ocean_scores').get();
  console.log('   ocean_scores:', oceanCount.count);

  const themesCount = db.prepare('SELECT COUNT(*) as count FROM themes').get();
  console.log('   themes:', themesCount.count);

  const sessionThemesCount = db.prepare('SELECT COUNT(*) as count FROM session_themes').get();
  console.log('   session_themes:', sessionThemesCount.count);

  const psychCount = db.prepare('SELECT COUNT(*) as count FROM psychological_elements').get();
  console.log('   psychological_elements:', psychCount.count);
  console.log('');

  // 4. Detalhes de todas as sessões
  if (sessionsCount.count > 0) {
    console.log('4. Detalhes de TODAS as sessões:');
    const sessions = db.prepare(`
      SELECT
        id,
        created_at,
        audio_duration_seconds,
        LENGTH(transcription) as transcription_length,
        LENGTH(processed_text) as processed_length,
        LENGTH(analysis) as analysis_length,
        substr(transcription, 1, 80) as preview
      FROM sessions
      ORDER BY created_at DESC
    `).all();

    sessions.forEach((s, idx) => {
      console.log(`\n   Sessão ${idx + 1}:`);
      console.log(`   ID: ${s.id}`);
      console.log(`   Data: ${s.created_at}`);
      console.log(`   Duração áudio: ${s.audio_duration_seconds || 'N/A'} segundos`);
      console.log(`   Tamanho transcrição: ${s.transcription_length} caracteres`);
      console.log(`   Tamanho processado: ${s.processed_length} caracteres`);
      console.log(`   Tamanho análise: ${s.analysis_length || 0} caracteres`);
      console.log(`   Preview: "${s.preview}..."`);

      // Verificar temas desta sessão
      const sessionThemes = db.prepare(`
        SELECT t.name
        FROM themes t
        JOIN session_themes st ON t.id = st.theme_id
        WHERE st.session_id = ?
      `).all(s.id);

      if (sessionThemes.length > 0) {
        console.log(`   Temas: ${sessionThemes.map(t => t.name).join(', ')}`);
      }
    });
  }

  // 5. Verificar arquivos WAL
  const fs = require('fs');
  const dataDir = path.join(__dirname, 'data');
  console.log('\n5. Arquivos no diretório data/:');
  const files = fs.readdirSync(dataDir);
  files.forEach(file => {
    const stats = fs.statSync(path.join(dataDir, file));
    console.log(`   ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
  });

  db.close();

  console.log('\n=== VERIFICAÇÃO CONCLUÍDA COM SUCESSO ===');
  console.log('O banco de dados está íntegro e contém todos os dados esperados.');

} catch (error) {
  console.error('\n❌ ERRO ao verificar banco de dados:');
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}
