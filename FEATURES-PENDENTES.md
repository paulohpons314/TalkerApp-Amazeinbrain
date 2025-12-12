# 📋 Features Pendentes & Melhorias Planejadas

> 📅 **Documento Criado em:** 2025-12-01
> 🖥️ **Plataforma:** VS Code + Claude Code CLI
> 📝 **Propósito:** Registrar funcionalidades a integrar e alterações a fazer (modo conversacional com memória persistente)

---

## ⚡ STATUS DE TAREFAS (Atualizado: 04/12/2025)

> **Visão consolidada de todas as tarefas, ordenadas por urgência e timeline**

### 🔴 EM ANDAMENTO / BLOQUEIO

Nenhuma tarefa em andamento no momento.

---

### 🔴 PRIORIDADE ALTA (Próximas Ações)

| # | Tarefa | Status | Previsão |
|---|--------|--------|----------|
| **7** | 🔴 **Arquitetura de Segurança & Privacidade** | 🟡 Planejado | 04/12/2025 |
| **0** | 🎨 **Redesign UI/UX + Self-Solar System 3D** | 🟡 Planejamento Concluído | Fase 3 |
| **2** | 🌌 **Integração Self-Solar System (Backend + Data)** | 🟡 Planejado | Após UI/UX |
| **1** | 🛡️ **Salvaguardas UX (Prevenção Perda de Dados)** | 🟡 Planejado | Após Redesign UI |

---

### 🟡 PRIORIDADE MÉDIA

| # | Tarefa | Status | Previsão |
|---|--------|--------|----------|
| **4** | 📄 **Export de Dados (PDF/CSV/TXT)** | 🟡 Em Andamento | Fase 4 |
| **3** | ⚙️ **Sistema de Templates Personalizáveis** | 🟡 Planejado | Fase 4 |

---

### 🔵 BACKLOG (Futuro)

| # | Tarefa | Status |
|---|--------|--------|
| **5** | 🌍 **Multi-Idioma** | 🔵 Backlog |
| **6** | 🎨 **Temas Personalizados (Dark/Light/Custom)** | 🔵 Backlog |

---

### ✅ CONCLUÍDO (Recente → Antiga)

_(Nenhuma tarefa concluída ainda)_

---

## 📖 DETALHAMENTO COMPLETO DAS FEATURES

### 🔴 PRIORIDADE ALTA

---

#### 7. 🔴 Decidir medidas de privacidade de alto nível

**Contexto:**
Todo sistema que se propõe a registrar, reproduzir, processar e salvar dados sensíveis deve ter dispositivos de segurança de dados como prioridade. Este projeto lida com o que existe de mais caro para a privacidade de uma pessoa. Mais sensível do que a privacidade de nossos hábitos e comportamento são nossos pensamentos sobre hábitos, comportamentos, sentimentos, gostos, outras pessoas, o mundo conforme nossa perspectiva e experiência.

**Impacto:**
Absoluto. Não basta o sistema mais seguro, é preciso que o utilizador perceba esta segurança.

**Soluções Propostas:**
PRIORIZAR ARQUITETURA DE SEGURANÇA ANTES DE PROSSEGUIR para a próxima fase.

**Status:** 🟡 Planejado
**Data prevista:** 04/12/2025 (planejamento)

---

#### 0. Redesign UI/UX com Self-Solar System 3D

**Contexto:**
Durante sessão de brainstorm (2025-12-01), Paulo definiu diretrizes visuais completas para integração do modelo matemático Self-Solar System como módulo 3D interativo.

**Decisões Aprovadas:**
- **Estilo Visual:** Orgânico/Emocional (gradientes suaves, glow effects, linhas onduladas)
- **Movimento:** Simulação em tempo real com física sutil (emoções orbitam o EU)
- **Paleta:** Cores Plutchik dessaturadas (ex: alegria = `#d4af37`, tristeza = `#5b7a9f`)
- **Tipografia:** Inter (legível, moderna, científica mas humana)
- **Tendências:** Immersive 3D, Emotionally Intelligent Design, Light Effects, Animated Elements

**Arquitetura:**
- **Front 1:** Análise Tradicional (BIG FIVE) com apresentação temporal melhorada + chat assistant
- **Front 2:** Self-Solar System Module (Cosmos 3D com detecção automática de emoções por Claude)

**Documento de Referência:**
📋 `docs/UI-DESIGN-DIRECTIVES.md` — Especificação completa aprovada

**Status:** 🟡 Planejamento Concluído
**Data prevista:** Início Fase 3 (próxima sessão)

---

#### 1. Salvaguardas de UX - Prevenção de Perda de Dados

**Contexto:**
Durante teste em 2025-12-01, Paulo gravou 10 minutos de reflexão pessoal. Ao concluir, o servidor não estava rodando (esqueceu de reiniciar). A transcrição ficou processando indefinidamente e **todo o áudio foi perdido**.

> *"É devastador perder 10 minutos de reflexão íntima. Como perder 10 páginas de diário quando cai café em cima."* — Paulo

**Impacto:**
Perda de dados em contexto **emocional/íntimo** é exponencialmente mais frustrante que perda de dados técnicos.

**Soluções Propostas:**

##### 1.1 Status de Conexão com APIs (Pré-Gravação)
- **O quê:** Indicador visual (luz verde/vermelha) mostrando se servidor está online **antes** de iniciar gravação
- **Como:** Ping rápido em `/api/health` ao carregar página
- **UI:** Badge pequeno no canto (🟢 Online / 🔴 Offline)
- **Critério de sucesso:** Usuário **não pode** começar a gravar se servidor estiver down

##### 1.2 Auto-Save Local do Áudio (Durante Gravação)
- **O quê:** Salvar blob de áudio em IndexedDB **conforme grava**, não apenas ao final
- **Como:** `MediaRecorder.ondataavailable` já salva chunks — persistir em IndexedDB também
- **Benefício:** Se servidor cair, áudio fica salvo localmente
- **Critério de sucesso:** Após refresh da página, usuário pode recuperar gravação

##### 1.3 Botão de Recuperação (Pós-Falha)
- **O quê:** Se transcrição/processamento falhar, mostrar botão "Tentar Novamente com Último Áudio"
- **Como:** Manter último blob em estado/localStorage até sucesso
- **UI:** Alert com botão de retry ao invés de apenas erro genérico
- **Critério de sucesso:** Usuário **nunca** precisa regravar após falha técnica

##### 1.4 Indicador Visual de Servidor Down
- **O quê:** Se servidor cair **durante** uso, mostrar modal claro
- **Como:** Heartbeat periódico (a cada 30s?) enquanto app estiver aberto
- **UI:** Modal bloqueante: "⚠️ Servidor offline. Gravações serão salvas localmente até reconexão."
- **Critério de sucesso:** Usuário **sempre sabe** o estado do sistema

**Status:** 🟡 Planejado
**Data prevista:** Após redesign de UI (Fase 3)

---

#### 2. Integração com Self-Solar System

**Contexto:**
Modelo criado por Paulo para análise da **dinâmica das emoções** (referenciado em `DESIGN_PRINCIPLES.md`).

**O quê:**
Sistema que mapeia emoções de forma relacional e temporal, substituindo análise OCEAN tradicional por algo mais fluido e contextualizado.

**Por quê integrar:**
- Insights Panel atual tem **alucinações estatísticas** (ex: "200% ansiedade")
- Self-Solar System é mais adequado para análise emocional **dinâmica**
- OCEAN é bom para traços de personalidade, mas **emocional precisa de outro framework**

**O que muda:**
- Insights Panel será **reescrito** usando Self-Solar System como base
- Gráficos mostrarão **dinâmica emocional** ao invés de scores estáticos
- Baseline emocional personalizado (conforme DESIGN_PRINCIPLES.md)

**Dependências:**
- Self-Solar System precisa estar **funcional** e documentado
- Definir como integrar com database SQLite (nova tabela? novo schema?)
- Redesign de UI provavelmente impactará visualização

**Status:** 🟡 Planejado
**Data prevista:** Imediatamente após decisão final sobre UI/UX

---

### 🟡 PRIORIDADE MÉDIA

---

#### 3. Sistema de Templates Personalizáveis

**Contexto:**
Atualmente, prompt enviado ao Claude é **fixo** (via `lib/prompts/builder.ts`).

**O quê:**
Permitir que usuário:
- Escolha **tom** (empático, clínico, neutro)
- Escolha **profundidade** (rápida, moderada, profunda)
- Crie **templates customizados** (ex: "Análise para terapeuta", "Diário pessoal")

**Como:**
- Interface de configuração (Settings page?)
- Salvar preferências em localStorage ou database
- PromptBuilder já tem suporte a variantes — só falta UI

**Status:** 🟡 Planejado
**Data prevista:** Fase 4 (pós-UI + pós-Self-Solar)

---

#### 4. Export de Dados (PDF/CSV/TXT)

**Contexto:**
Usuários podem querer:
- Compartilhar análise com terapeuta (PDF formatado)
- Exportar histórico para análise externa (CSV)
- Backup simples (TXT)

**O quê:**
- Botão "Exportar" em cada sessão do histórico
- Escolher formato
- Geração server-side ou client-side (definir)

**Tecnologias possíveis:**
- PDF: `react-pdf` ou `jsPDF`
- CSV: Simples (JavaScript nativo)
- TXT: Trivial

**Status:** 🟡 Em Andamento
**Data prevista:** Fase 4

---

### 🔵 PRIORIDADE BAIXA (Backlog Futuro)

---

#### 5. Multi-Idioma

**Contexto:**
App atualmente funciona apenas em português.

**O quê:**
Suporte a inglês, espanhol, etc.

**Desafios:**
- Whisper já suporta multi-idioma (fácil)
- Claude também (fácil)
- UI precisa de i18n (trabalhoso)
- Prompts psicológicos precisam ser **re-escritos** para cada idioma (muito trabalhoso)

**Status:** 🔵 Backlog
**Data prevista:** TBD

---

#### 6. Temas Personalizados (Dark/Light/Custom)

**Contexto:**
App tem dark mode, mas não é customizável.

**O quê:**
- Seletor de temas
- Cores personalizáveis
- Salvar preferência

**Status:** 🔵 Backlog
**Data prevista:** TBD

---

## 📝 Como Atualizar Este Documento

Sempre que uma nova feature for:
1. **Proposta:** Adicionar aqui com contexto + prioridade
2. **Iniciada:** Mudar status para 🟡 Em Andamento (atualizar tabela STATUS DE TAREFAS no topo)
3. **Concluída:** Mover para seção "✅ Concluído" com data (atualizar tabela STATUS DE TAREFAS no topo)

**Template para novas features:**
```markdown
### N. Nome da Feature

**Contexto:**
[Por que isso surgiu? Qual problema resolve?]

**O quê:**
[Descrição da funcionalidade]

**Como (se já pensado):**
[Abordagem técnica, se houver]

**Status:** 🟡 Planejado
**Data prevista:** [Quando pretendemos fazer]
```

---

## 🔄 Histórico de Atualizações

| Data | Mudança | Autor |
|------|---------|-------|
| 2025-12-01 | Criação inicial do documento | Paulo + Claude |
| 2025-12-01 | Adicionada Feature 0: Redesign UI/UX com Self-Solar System 3D (prioridade alta) | Paulo + Claude |
| 2025-12-04 | Reestruturação completa: STATUS DE TAREFAS no topo (ordem temporal decrescente) | Paulo + Claude |
| 2025-12-04 | Corrigido item 7 (Privacidade) - adicionado emoji 🔴 e corrigida data para 04/12/2025 | Paulo + Claude |

---

**Última atualização:** 2025-12-04
**Próxima revisão:** Após definição de arquitetura de segurança (Item 7)
