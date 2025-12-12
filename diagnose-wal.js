const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'talkerapp.db');
const walPath = dbPath + '-wal';
const shmPath = dbPath + '-shm';

console.log('=== DIAGNÓSTICO DE POSSÍVEIS CAUSAS DO BUG ===\n');

console.log('1. ANÁLISE DOS ARQUIVOS WAL (Write-Ahead Log):');
console.log('   - O SQLite em modo WAL mantém mudanças em arquivos separados');
console.log('   - Se o WAL não for aplicado, dados recentes podem "desaparecer"\n');

// Verificar tamanhos dos arquivos
const dbSize = fs.statSync(dbPath).size;
const walSize = fs.existsSync(walPath) ? fs.statSync(walPath).size : 0;
const shmSize = fs.existsSync(shmPath) ? fs.statSync(shmPath).size : 0;

console.log('   Tamanhos atuais:');
console.log(`   - talkerapp.db: ${(dbSize / 1024).toFixed(2)} KB`);
console.log(`   - talkerapp.db-wal: ${(walSize / 1024).toFixed(2)} KB`);
console.log(`   - talkerapp.db-shm: ${(shmSize / 1024).toFixed(2)} KB\n`);

if (walSize > 100000) {
  console.log('   ⚠️  WAL GRANDE DETECTADO (>100KB)!');
  console.log('   - Isso pode indicar que o WAL não foi consolidado (checkpoint)');
  console.log('   - Dados podem estar "presos" no WAL\n');
}

console.log('2. POSSÍVEIS CAUSAS DO BUG:\n');

console.log('   A) PROCESSO TRAVADO:');
console.log('   - Se um processo Node.js anterior travou sem fechar o DB');
console.log('   - O WAL fica "locked" e dados podem não aparecer');
console.log('   - Solução: Fechar todos os processos Node.js\n');

console.log('   B) CHECKPOINT NÃO EXECUTADO:');
console.log('   - Dados ficam no WAL sem serem consolidados no DB principal');
console.log('   - Solução: Executar WAL checkpoint manualmente\n');

console.log('   C) ERRO DE LEITURA SILENCIOSO:');
console.log('   - API pode ter falhado e retornado array vazio');
console.log('   - Frontend não mostrou erro, apenas "sem sessões"\n');

console.log('   D) CACHE DO BROWSER:');
console.log('   - Browser pode ter mostrado versão antiga da página');
console.log('   - Solução: Hard refresh (Ctrl+Shift+R)\n');

console.log('3. EXECUTANDO WAL CHECKPOINT PARA CONSOLIDAR DADOS:\n');

try {
  const db = new Database(dbPath);

  // Verificar journal mode
  const journalMode = db.pragma('journal_mode', { simple: true });
  console.log(`   Modo atual: ${journalMode}`);

  // Executar checkpoint
  console.log('   Executando checkpoint...');
  const checkpoint = db.pragma('wal_checkpoint(TRUNCATE)', { simple: true });
  console.log(`   Resultado: ${JSON.stringify(checkpoint)}`);

  // Verificar integridade
  const integrity = db.prepare('PRAGMA integrity_check').get();
  console.log(`   Integridade: ${integrity.integrity_check}\n`);

  db.close();

  // Verificar tamanhos após checkpoint
  const newWalSize = fs.existsSync(walPath) ? fs.statSync(walPath).size : 0;
  console.log(`   WAL após checkpoint: ${(newWalSize / 1024).toFixed(2)} KB`);

  if (newWalSize < walSize) {
    console.log('   ✓ WAL foi consolidado com sucesso!\n');
  }

} catch (error) {
  console.error('   ❌ Erro ao executar checkpoint:', error.message);
}

console.log('4. RECOMENDAÇÕES PARA PREVENIR:\n');
console.log('   1. Sempre fechar processos npm dev corretamente (Ctrl+C)');
console.log('   2. Adicionar checkpoint automático periódico');
console.log('   3. Implementar tratamento de erros visível no frontend');
console.log('   4. Adicionar logging de erros em arquivo\n');

console.log('=== DIAGNÓSTICO CONCLUÍDO ===');
