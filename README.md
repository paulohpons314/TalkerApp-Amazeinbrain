# TalkerApp Web - PWA

Aplicação web para gravação de voz e processamento com IA.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Styling:** Tailwind CSS 4
- **APIs:** 
  - OpenAI Whisper (transcrição)
  - Anthropic Claude (processamento)
- **PWA:** Instalável (manifest.json)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de exemplo de variáveis de ambiente
copy .env.local.example .env.local

# Editar .env.local com suas API keys
# OPENAI_API_KEY=sua-key-aqui
# ANTHROPIC_API_KEY=sua-key-aqui
```

## 🔑 Configuração de API Keys

1. **OpenAI API Key:**
   - Acesse: https://platform.openai.com/api-keys
   - Crie uma nova API key
   - Cole no `.env.local`

2. **Anthropic API Key:**
   - Acesse: https://console.anthropic.com/settings/keys
   - Crie uma nova API key
   - Cole no `.env.local`

## 💻 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em: http://localhost:3000
```

## 🏗️ Build para Produção

```bash
# Criar build otimizado
npm run build

# Testar build localmente
npm start
```

## 🌐 Deploy (Vercel)

### Opção 1: Via GitHub
1. Push para GitHub
2. Conectar repositório na Vercel
3. Configurar variáveis de ambiente no painel da Vercel
4. Deploy automático

### Opção 2: Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

## 📱 PWA - Instalação

Após deploy, usuários podem instalar como app:

- **Desktop:** Chrome/Edge → Menu → "Instalar TalkerApp"
- **Mobile:** Safari/Chrome → Compartilhar → "Adicionar à Tela Inicial"

## 🎯 Funcionalidades

- ✅ Gravação de áudio via navegador
- ✅ Transcrição automática (Whisper API)
- ✅ Processamento de texto (Claude API)
- ✅ Modo append (adicionar ao texto existente)
- ✅ Copiar resultado para clipboard
- ✅ Interface responsiva (desktop + mobile)
- ✅ PWA instalável
- ✅ Dark mode

## 🔒 Segurança

- API keys armazenadas no servidor (`.env.local`)
- Nunca expostas ao cliente
- Rotas API protegidas
- `.env.local` no `.gitignore`

## 📂 Estrutura do Projeto

```
talker-app-web/
├── app/
│   ├── api/
│   │   ├── transcribe/route.ts  # Whisper API
│   │   └── process/route.ts     # Claude API
│   ├── layout.tsx               # Layout global + PWA config
│   ├── page.tsx                 # Homepage
│   └── globals.css
├── components/
│   ├── TalkerApp.tsx            # Componente principal
│   ├── AudioRecorder.tsx        # Gravação de áudio
│   └── ResultDisplay.tsx        # Exibição de resultados
├── public/
│   └── manifest.json            # PWA manifest
├── .env.local                   # API keys (NÃO COMMITAR)
└── package.json
```

## 🆚 Diferenças vs Electron

| Aspecto | Electron | Next.js PWA |
|---------|----------|-------------|
| Build time | ~60s | ~5s |
| Hot reload | Quebrado | Instant |
| API keys | Expostas | Seguras (servidor) |
| Acesso | Terminal | URL |
| Install | .exe/script | 1 clique PWA |
| Updates | Manual | Automático |
| Mobile | ❌ | ✅ |

## 🐛 Troubleshooting

### Erro: "API key not found"
- Verifique se `.env.local` existe
- Confirme que as keys estão corretas
- Restart do servidor após adicionar keys

### PWA não instala
- Deve estar em HTTPS (produção)
- Verifique `manifest.json`
- Teste em Chrome/Edge

### Microfone não funciona
- Permitir acesso ao microfone no navegador
- HTTPS é obrigatório (exceto localhost)

## 📝 To-Do Futuro

- [ ] Histórico de gravações
- [ ] Export para PDF/Word
- [ ] Integração MCP servers
- [ ] Multi-idioma
- [ ] Themes personalizados

---

**Migrado de Electron para Next.js** - 26/10/2025

