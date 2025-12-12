# Solução: Bug do Histórico Vazio

**Data:** 08/12/2025
**Severidade:** Média
**Status:** ✅ Resolvido

## Resumo do Problema

O histórico de sessões aparecia vazio ao abrir o TalkerApp, mesmo com 11 sessões armazenadas no banco de dados.

## Causa Raiz Identificada

### Problema com WAL (Write-Ahead Logging) do SQLite

O SQLite estava configurado para usar o modo WAL (Write-Ahead Logging), que oferece melhor performance mas requer manutenção adequada:

- **WAL não consolidado:** 728 KB de dados no arquivo `.db-wal`
- **Arquivo principal pequeno:** Apenas 248 KB no `talkerapp.db`
- **Checkpoint ausente:** Dados ficaram "presos" no WAL

### Como o Bug Ocorreu

1. Processo Node.js foi encerrado abruptamente (sem Ctrl+C adequado ou travamento)
2. O WAL não foi consolidado no arquivo principal do banco
3. Na próxima inicialização, dependendo do timing, o banco pode ter sido lido sem o WAL
4. Resultado: histórico apareceu vazio (dados existiam, mas não eram visíveis)

## Solução Implementada

### 1. Checkpoint Automático Periódico

**Arquivo:** `lib/database.ts`

```typescript
function setupDatabaseMaintenance(database: Database.Database) {
  // Checkpoint automático a cada 5 minutos
  const CHECKPOINT_INTERVAL = 5 * 60 * 1000;

  const checkpointTimer = setInterval(() => {
    try {
      // PASSIVE: não bloqueia leituras/escritas
      database.pragma('wal_checkpoint(PASSIVE)');
      console.log('[DB] WAL checkpoint executado com sucesso');
    } catch (error) {
      console.error('[DB] Erro ao executar checkpoint:', error);
    }
  }, CHECKPOINT_INTERVAL);

  // Limpar timer ao encerrar
  process.on('beforeExit', () => {
    clearInterval(checkpointTimer);
  });
}
```

**Benefícios:**
- Consolida WAL regularmente (a cada 5 minutos)
- Não bloqueia operações de leitura/escrita (modo PASSIVE)
- Reduz risco de dados ficarem "presos" no WAL

### 2. Graceful Shutdown

**Arquivo:** `lib/database.ts`

```typescript
function closeDatabase() {
  if (db) {
    try {
      // Checkpoint final (TRUNCATE = consolidar e limpar WAL)
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

// Capturar sinais de encerramento
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
```

**Benefícios:**
- Garante que o WAL seja consolidado ao encerrar
- Captura múltiplos sinais de encerramento (Ctrl+C, kill, etc.)
- Logs claros do processo de shutdown

### 3. Tratamento de Erros Visível no Frontend

**Arquivo:** `app/history/page.tsx`

**Mudanças:**
- Estado de erro: `const [error, setError] = useState<string | null>(null)`
- Validação de resposta HTTP
- Mensagens de erro detalhadas no console
- Banner de erro visível na interface com botão "Tentar novamente"

```typescript
// Exemplo de tratamento melhorado
const loadSessions = async () => {
  try {
    setError(null);
    const response = await fetch('/api/history?limit=50');

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      setSessions(result.data);
      console.log(`[History] ${result.data.length} sessões carregadas`);
    } else {
      throw new Error(result.error || 'Erro desconhecido');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('❌ Erro ao carregar histórico:', errorMessage);
    setError(`Falha ao carregar histórico: ${errorMessage}`);
    setSessions([]);
  } finally {
    setLoading(false);
  }
};
```

**Benefícios:**
- Usuário vê mensagem clara de erro (não apenas "sem sessões")
- Logs detalhados no console para debugging
- Botão para tentar recarregar

## Como Prevenir no Futuro

### Boas Práticas para Desenvolvedores

1. **Sempre usar Ctrl+C para parar o servidor**
   - Nunca fechar o terminal abruptamente
   - Aguardar a mensagem de shutdown completar

2. **Monitorar tamanho do WAL**
   - Se `.db-wal` ficar muito grande (>100 KB), investigar
   - Executar checkpoint manual se necessário

3. **Verificar logs**
   - Procurar por `[DB] WAL checkpoint executado com sucesso`
   - Verificar mensagens de shutdown ao parar servidor

### Comando Manual de Checkpoint

Se necessário, executar checkpoint manual:

```bash
node diagnose-wal.js
```

Este script:
- Verifica tamanho do WAL
- Executa checkpoint
- Valida integridade do banco

## Verificação da Solução

### Status Atual

✅ **Banco de dados:** 11 sessões íntegras e acessíveis
✅ **API:** Funcionando corretamente em http://localhost:3002
✅ **Frontend:** Carrega sessões sem erro
✅ **WAL:** Consolidado (0 KB após checkpoint)
✅ **Checkpoint automático:** Configurado para executar a cada 5 minutos
✅ **Graceful shutdown:** Implementado com múltiplos sinais
✅ **Tratamento de erros:** Mensagens claras para o usuário

### Arquivos Modificados

1. `lib/database.ts` - Checkpoint automático e graceful shutdown
2. `app/history/page.tsx` - Tratamento de erros melhorado
3. `docs/BUG-HISTORICO-VAZIO-SOLUCAO.md` - Esta documentação

### Scripts de Diagnóstico Criados

- `verify-db-integrity.js` - Verifica integridade completa do banco
- `diagnose-wal.js` - Diagnóstico e checkpoint manual do WAL
- `check-db.js` - Verifica conteúdo básico do banco

## Lições Aprendidas

1. **SQLite WAL requer manutenção:** Modo WAL é excelente para performance, mas precisa de checkpoints regulares
2. **Graceful shutdown é crítico:** Processos devem sempre consolidar dados antes de encerrar
3. **Erros silenciosos são perigosos:** Usuário precisa ver mensagens claras quando algo falha
4. **Logging é essencial:** Logs detalhados facilitam diagnóstico de problemas

## Referências

- [SQLite Write-Ahead Logging](https://www.sqlite.org/wal.html)
- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- Node.js Process Signals: SIGINT, SIGTERM, exit

---

**Próximos Passos Recomendados:**

1. Monitorar logs por alguns dias para confirmar checkpoint automático
2. Considerar adicionar telemetria para rastrear tamanho do WAL
3. Implementar health check endpoint que valida integridade do banco
