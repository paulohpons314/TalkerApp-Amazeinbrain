# TalkerApp - AmazeinBrain

**Voice recording and AI-powered psychological analysis tool**

> 📅 **Last Updated:** 2025-12-08
> 🖥️ **Platform:** VS Code + Claude Code CLI
> 🏗️ **Status:** Development - Core functional + Database hardening complete

---

## 🎯 O que é o TalkerApp

Aplicação web (PWA) que permite gravação de voz ou upload de áudio, transcreve com Whisper (OpenAI), processa com Claude (Anthropic) e gera análises psicológicas profundas baseadas em frameworks estabelecidos (BIG FIVE, Teoria do Apego, Regulação Emocional, etc.).

### Diferencial

Não é um "app de humor" genérico. É uma ferramenta de **comunicação** que prioriza:
- **Dados objetivos** antes de interpretações
- **Citações literais** como evidência
- **Contexto dual** (positivo/negativo) para scores
- **Baseline emocional personalizado** (seu normal vs. momento atual)

📖 **Filosofia completa:** Ver [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md)

---

## 🚀 Stack Tecnológica

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript 5.9
- **UI:** Tailwind CSS 4
- **Database:** SQLite (better-sqlite3) com Full-Text Search
- **Charts:** Recharts
- **APIs:**
  - OpenAI Whisper (transcrição)
  - Anthropic Claude Sonnet-4.5 (processamento)

---

## ⚙️ Setup Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar API Keys
```bash
# Copiar template
copy .env.local.example .env.local

# Editar .env.local e adicionar:
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

**Onde conseguir keys:**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/settings/keys

### 3. Rodar desenvolvimento
```bash
npm run dev
# Acesse: http://localhost:3000
```

---

## 📂 Estrutura do Projeto

```
TalkerApp-Amazeinbrain/
├── app/                      # Next.js App Router
│   ├── api/                  # Rotas de API (server-side)
│   │   ├── transcribe/       # POST - Whisper transcription
│   │   │   └── route.ts      # Endpoint de transcrição de áudio
│   │   ├── process/          # POST - Claude AI processing
│   │   │   └── route.ts      # Endpoint de processamento com Claude
│   │   ├── history/          # GET/POST/PATCH/DELETE - CRUD de sessões
│   │   │   └── route.ts      # Gerenciamento completo do histórico
│   │   └── insights/         # GET - Queries analíticas agregadas
│   │       └── route.ts      # Estatísticas e métricas temporais
│   │
│   ├── history/              # Página de histórico de sessões
│   │   └── page.tsx          # Interface de visualização e busca
│   ├── page.tsx              # Homepage - gravador principal
│   ├── layout.tsx            # Layout raiz + metadados PWA
│   ├── globals.css           # Estilos globais + Tailwind
│   └── favicon.ico           # Ícone da aplicação
│
├── components/               # Componentes React reutilizáveis
│   ├── TalkerApp.tsx         # Orquestrador principal do fluxo
│   ├── AudioRecorder.tsx     # Gravação/upload de áudio
│   ├── ResultDisplay.tsx     # Exibição de resultados (tabs)
│   └── InsightsPanel.tsx     # Painel de análise temporal (gráficos)
│
├── lib/                      # Lógica de negócio e utilidades
│   ├── database.ts           # 🔧 Schema SQLite + CRUD + Manutenção
│   │                         #    - WAL checkpoint automático (5min)
│   │                         #    - Graceful shutdown com consolidação
│   │                         #    - Tabelas: sessions, ocean_scores, themes,
│   │                         #      psychological_elements, session_themes
│   │                         #    - Full-Text Search (FTS5)
│   │
│   ├── analytics.ts          # Queries complexas para insights
│   │                         #    - Evolução temporal de scores OCEAN
│   │                         #    - Temas mais frequentes
│   │                         #    - Padrões psicológicos dominantes
│   │
│   ├── types.ts              # Definições TypeScript compartilhadas
│   │
│   └── prompts/              # Sistema modular de prompts
│       ├── builder.ts        # Compositor dinâmico de prompts
│       ├── templates/        # Templates base de prompts
│       └── variants/         # Variações de tom e profundidade
│
├── data/                     # Dados persistentes (SQLite)
│   ├── talkerapp.db          # Banco principal (auto-criado)
│   ├── talkerapp.db-wal      # Write-Ahead Log (auto-gerenciado)
│   └── talkerapp.db-shm      # Shared Memory (auto-gerenciado)
│
├── docs/                     # Documentação do projeto
│   ├── BUG-HISTORICO-VAZIO-SOLUCAO.md  # Postmortem do bug de WAL
│   ├── archive/              # Histórico de desenvolvimento
│   └── experiments/          # Testes e componentes experimentais
│
├── public/                   # Assets estáticos
│   ├── icon-192.png          # PWA icon (192x192)
│   ├── icon-512.png          # PWA icon (512x512)
│   └── manifest.json         # Manifesto PWA
│
├── .env.local                # Variáveis de ambiente (não versionado)
├── .env.local.example        # Template de configuração
├── .gitignore                # Arquivos ignorados pelo Git
├── next.config.mjs           # Configuração do Next.js
├── tailwind.config.ts        # Configuração do Tailwind CSS
├── tsconfig.json             # Configuração do TypeScript
├── package.json              # Dependências e scripts
└── README.md                 # Este arquivo
```

### 📁 Detalhes Importantes

**Database (`lib/database.ts`):**
- **WAL Mode:** Modo Write-Ahead Logging ativado para melhor performance
- **Checkpoint Automático:** Executa a cada 5 minutos para consolidar WAL
- **Graceful Shutdown:** Consolida dados antes de encerrar processo
- **FTS5:** Full-Text Search para busca semântica nas transcrições

**API Routes:**
- Todas as rotas são server-side only (protegem API keys)
- Validação de entrada e tratamento de erros robusto
- Logs detalhados para debugging

**PWA:**
- Instalável em desktop e mobile
- Funciona offline (após primeira visita)
- Cache de assets estáticos

---

## 🎨 Roadmap

### ✅ Fase 1: Core Funcional (Concluído)
- [x] Gravação + Upload de áudio
- [x] Transcrição Whisper
- [x] Processamento Claude
- [x] Database SQLite com Full-Text Search
- [x] Histórico de sessões
- [x] Extração automática de OCEAN scores, temas, elementos psicológicos
- [x] Gráficos temporais (Insights Panel)

### 🔄 Fase 2: Organização (Em Andamento)
- [x] Limpeza de código
- [x] Arquivar documentação excessiva
- [x] Consolidar README
- [ ] Estabelecer guidelines de documentação

### 🔮 Fase 3: Próximos Passos
- [ ] Redesign completo da UI/UX
- [ ] Integração com Self-Solar System (análise emocional dinâmica)
- [ ] Correção de alucinações no Insights Panel
- [ ] Sistema de templates personalizáveis
- [ ] Export para PDF/CSV/TXT

---

## 🔧 Funcionalidades Atuais

✅ **Gravação:**
- Microfone web com visualização em tempo real
- Pause/Resume/Cancel
- Upload de arquivos de áudio (WAV, MP3, M4A, WEBM, OGG)

✅ **Processamento:**
- Transcrição em português (Whisper)
- Análise psicológica profunda (Claude)
- Parsing automático de OCEAN scores
- Extração de temas recorrentes
- Identificação de vieses cognitivos e mecanismos de defesa

✅ **Análise Temporal:**
- Evolução de traços OCEAN ao longo do tempo
- Temas mais frequentes
- Padrões psicológicos dominantes
- Estatísticas gerais (total de sessões, tempo médio, etc.)

✅ **Outros:**
- Cópia rápida para clipboard
- Modo append (adicionar conteúdo à sessão atual)
- Dark mode
- PWA instalável

---

## 📚 Documentação

- **Princípios de Design:** [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) - Filosofia UX e guidelines de comunicação empática
- **Guidelines de Documentação:** [`DOCUMENTATION-GUIDELINES.md`](./DOCUMENTATION-GUIDELINES.md) - Como documentar mudanças
- **Arquivo de Sessões:** `docs/archive/` - Histórico de desenvolvimento

---

## 🔒 Segurança

- API keys **nunca** expostas ao cliente (server-side only)
- `.env.local` em `.gitignore`
- Database local (SQLite) - sem servidor remoto
- Rotas API protegidas

---

## 🐛 Troubleshooting

**Erro: "API key not found"**
- Confirme que `.env.local` existe na raiz
- Verifique se as keys estão corretas (sem espaços extras)
- Restart do servidor: `npm run dev`

**Microfone não funciona**
- Permitir acesso ao microfone no navegador
- HTTPS obrigatório (exceto `localhost`)

**Histórico de sessões aparece vazio** ✨
- **Causa:** WAL do SQLite não consolidado (dados "presos")
- **Solução imediata:** Reiniciar o servidor com `Ctrl+C` (graceful shutdown)
- **Prevenção:** Sempre usar `Ctrl+C` para parar o servidor (nunca fechar terminal abruptamente)
- **Verificação:** Executar `node diagnose-wal.js` para checar integridade
- **Documentação completa:** Ver `docs/BUG-HISTORICO-VAZIO-SOLUCAO.md`

**Insights mostrando dados estranhos**
- Conhecido: alucinações estatísticas (ex: "200% ansiedade")
- Correção planejada para Fase 3 (integração Self-Solar System)

### 🔧 Boas Práticas para Desenvolvimento

**Ao encerrar o servidor:**
1. Sempre use `Ctrl+C` no terminal (nunca feche a janela)
2. Aguarde as mensagens de log mostrando o shutdown:
   ```
   [DB] Recebido SIGINT, encerrando gracefully...
   [DB] Executando checkpoint final antes de fechar...
   [DB] Banco de dados fechado com sucesso
   ```
3. Isso garante que dados no WAL sejam consolidados

**Monitoramento de saúde:**
- Checkpoint automático executa a cada 5 minutos
- Procure por: `[DB] WAL checkpoint executado com sucesso` nos logs
- Se o WAL ficar > 100 KB, execute `node diagnose-wal.js`

---

## 🤝 Contribuindo

Este é um projeto de pesquisa sobre **interação humano-IA colaborativa**.

Se você está lendo isso e quer contribuir, considere:
- Testar o app e relatar bugs
- Sugerir melhorias na UX (especialmente se você trabalha com saúde mental)
- Propor novos frameworks psicológicos para análise

---

**Desenvolvido por Paulo** | Em colaboração com Claude (Anthropic)
📧 Contato: [adicionar se quiser]

---

*"Uma ferramenta que analisa emoções deve primeiro ser uma ferramenta de comunicação."*
