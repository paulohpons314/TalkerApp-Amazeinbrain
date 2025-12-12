// Simular exatamente o que a página de histórico faz
const { getAllSessions, getSessionCount } = require('./lib/database');

console.log('=== TESTE DA API DE HISTÓRICO ===\n');

try {
  console.log('1. Tentando buscar todas as sessões (como a página faz):');
  const sessions = getAllSessions(50, 0);
  console.log(`   Encontradas: ${sessions.length} sessões\n`);

  if (sessions.length > 0) {
    console.log('2. Primeiras 3 sessões retornadas:');
    sessions.slice(0, 3).forEach((s, idx) => {
      console.log(`\n   Sessão ${idx + 1}:`);
      console.log(`   - ID: ${s.id}`);
      console.log(`   - Data: ${s.created_at}`);
      console.log(`   - Preview: ${s.transcription.substring(0, 60)}...`);
    });
  }

  console.log('\n3. Contagem total:');
  const count = getSessionCount();
  console.log(`   Total no banco: ${count}`);

  console.log('\n=== TESTE CONCLUÍDO ===');
  console.log('A API está funcionando corretamente!');

} catch (error) {
  console.error('\n❌ ERRO ao testar API:');
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}
