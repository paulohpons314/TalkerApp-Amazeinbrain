# TalkerApp - AmazeinBrain

**Voice recording and AI-powered psychological analysis tool**

> 📅 **Last Updated:** 2025-12-01
> 🖥️ **Platform:** VS Code + Claude Code CLI
> 🏗️ **Status:** Development - Core functional, UI redesign pending

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
├── app/
│   ├── api/                  # Rotas Next.js API
│   │   ├── transcribe/       # Whisper transcription
│   │   ├── process/          # Claude processing
│   │   ├── history/          # CRUD sessions
│   │   └── insights/         # Analytics queries
│   ├── history/              # Página de histórico
│   ├── page.tsx              # Homepage
│   └── layout.tsx            # Layout global + PWA
│
├── components/
│   ├── TalkerApp.tsx         # Main orchestrator
│   ├── AudioRecorder.tsx     # Recording + upload
│   ├── ResultDisplay.tsx     # Results tabs
│   └── InsightsPanel.tsx     # Temporal analysis (graphs)
│
├── lib/
│   ├── database.ts           # SQLite schema + CRUD
│   ├── analytics.ts          # Complex queries
│   ├── types.ts              # TypeScript definitions
│   └── prompts/              # Modular prompt system
│       ├── builder.ts        # Prompt composer
│       ├── templates/        # Base prompt templates
│       └── variants/         # Tone/depth variants
│
├── data/
│   └── talkerapp.db          # SQLite database (auto-created)
│
└── docs/
    ├── archive/              # Documentação de sessões antigas
    └── experiments/          # Componentes de teste
```

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

**Insights mostrando dados estranhos**
- Conhecido: alucinações estatísticas (ex: "200% ansiedade")
- Correção planejada para Fase 3 (integração Self-Solar System)

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
