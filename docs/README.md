# 📚 TalkerApp - Índice de Documentação

> **Última atualização:** 2025-11-10  
> **Versão do projeto:** 2.0 (Next.js 16 + SQLite + Análise OCEAN)

---

## 📖 Estrutura de Documentação

Este diretório contém toda a documentação técnica e conceitual do TalkerApp, organizada cronologicamente e por categoria.

### 🗂️ Convenção de Nomenclatura

```
[AAAA-MM-DD]_[CATEGORIA]_[TÍTULO].md

Exemplo: 2025-11-10_FEATURE_Sistema-Historico-SQLite.md
```

**Categorias:**
- `ARCHITECTURE` - Decisões arquiteturais
- `FEATURE` - Novas funcionalidades implementadas
- `DESIGN` - Design de UX/UI e padrões visuais
- `INSIGHT` - Visões sobre evolução futura
- `MIGRATION` - Migrações e refatorações
- `GUIDE` - Guias de uso e testes
- `ROADMAP` - Planejamento futuro

---

## 📅 Documentos por Data (Mais Recentes)

### **2025-11-10**
- [`2025-11-10_FEATURE_Sistema-Historico-SQLite.md`](./2025-11-10_FEATURE_Sistema-Historico-SQLite.md) ⭐ **NOVO**
  - Sistema completo de histórico com banco relacional
  - Análises OCEAN e gráficos interativos
  - **Status:** ✅ Implementado e funcional

- [`2025-11-10_ARCHITECTURE_Prompt-Claude-OCEAN.md`](./2025-11-10_ARCHITECTURE_Prompt-Claude-OCEAN.md) ⭐ **NOVO**
  - Reestruturação do prompt Claude para análise psicológica
  - Modelo OCEAN (Big Five) + vieses cognitivos
  - **Status:** ✅ Implementado e testado

- [`2025-11-10_INSIGHT_Analise-Relacional-Camadas.md`](./2025-11-10_INSIGHT_Analise-Relacional-Camadas.md) ⭐ **NOVO**
  - Visão de análise relacional em múltiplas camadas
  - Correlação entre entidades (nomes, lugares, tópicos)
  - **Status:** 📋 Planejado para v3.0

### **2025-XX-XX** (Documentos Legados)
- [`REBUILDED-IN-NEXTJS.md`](../REBUILDED-IN-NEXTJS.md)
  - Migração de Electron para Next.js
  - **Status:** ✅ Concluído (referência histórica)

- [`ABOUT-SESSION-V2.2.md`](../ABOUT-SESSION-V2.2.md)
  - **Status:** ⚠️ Desatualizado (verificar relevância)

- [`QUICK-START.md`](../QUICK-START.md)
  - **Status:** ✅ Atualizado para Next.js 16

- [`VISUAL-LAB-GUIDE.md`](../VISUAL-LAB-GUIDE.md)
  - **Status:** ⚠️ Verificar relevância pós-SQLite

---

## 🏗️ Documentos por Categoria

### **ARCHITECTURE (Arquitetura)**
1. [`2025-11-10_ARCHITECTURE_Prompt-Claude-OCEAN.md`](./2025-11-10_ARCHITECTURE_Prompt-Claude-OCEAN.md)
2. [`SYSTEM-PROMPT-v1`](../SYSTEM-PROMPT-v1) - ⚠️ Substituído por PROMPT-CLAUDE.md

### **FEATURE (Funcionalidades)**
1. [`2025-11-10_FEATURE_Sistema-Historico-SQLite.md`](./2025-11-10_FEATURE_Sistema-Historico-SQLite.md)

### **DESIGN (UX/UI)**
- *Nenhum documento específico ainda*

### **INSIGHT (Visões Futuras)**
1. [`2025-11-10_INSIGHT_Analise-Relacional-Camadas.md`](./2025-11-10_INSIGHT_Analise-Relacional-Camadas.md)

### **MIGRATION (Migrações)**
1. [`REBUILDED-IN-NEXTJS.md`](../REBUILDED-IN-NEXTJS.md) (Histórico)

### **GUIDE (Guias)**
1. [`TESTING-GUIDE.md`](../TESTING-GUIDE.md) - Guia de teste de 3 sessões

---

## 🎯 Estado Atual do Projeto

**Versão:** 2.0  
**Stack:** Next.js 16 + React 19 + TypeScript + Tailwind + SQLite + Recharts  
**APIs:** OpenAI Whisper + Anthropic Claude Sonnet 4.5

### ✅ Funcionalidades Implementadas
- [x] Gravação de áudio com waveform
- [x] Transcrição via Whisper API
- [x] Processamento com Claude (prompt OCEAN otimizado)
- [x] Banco de dados SQLite relacional
- [x] Histórico de sessões com busca full-text
- [x] Análise OCEAN automática
- [x] Gráficos interativos (Radar, Linha, Barras)
- [x] Insights automáticos sobre padrões
- [x] Sistema Tag-Talker para comandos vocais

### 🚧 Em Planejamento (v3.0)
- [ ] Análise relacional em camadas
- [ ] Correlação entre entidades (nomes, lugares, eventos)
- [ ] Filtros dinâmicos por objetos
- [ ] Gráficos contextuais (ex: "ansiedade" + "projeto")
- [ ] Export PDF de relatórios
- [ ] Alertas inteligentes

---

## 📝 Como Contribuir com Documentação

### **Ao criar novo documento:**

1. Use o formato de nomenclatura padrão:
   ```
   [AAAA-MM-DD]_[CATEGORIA]_[Título-Kebab-Case].md
   ```

2. Inclua no cabeçalho:
   ```markdown
   # [Título do Documento]
   
   **Data:** AAAA-MM-DD  
   **Categoria:** [FEATURE/ARCHITECTURE/etc]  
   **Status:** [✅ Implementado | 🚧 Em Progresso | 📋 Planejado | ⚠️ Desatualizado]  
   **Autor:** [Nome ou "Colaboração IA"]
   
   ## Contexto
   [Situação que motivou este documento]
   
   ## Resumo
   [1-2 parágrafos descrevendo o conteúdo]
   ```

3. Atualize este `README.md` com link para o novo documento

### **Ao atualizar documento existente:**

- Adicione seção `## Histórico de Alterações` no final
- Registre data e resumo da alteração

---

## 🔍 Busca Rápida

**Precisa encontrar algo?**

- **Prompt Claude atual:** [`PROMPT-CLAUDE.md`](../PROMPT-CLAUDE.md)
- **Schema do banco:** [`lib/database.ts`](../lib/database.ts)
- **Queries analíticas:** [`lib/analytics.ts`](../lib/analytics.ts)
- **Copilot instructions:** [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)

---

## 📊 Métricas de Documentação

- **Total de documentos:** 11
- **Atualizados (< 30 dias):** 4
- **Legados (> 90 dias):** 3
- **Cobertura de features:** 80%

---

## 🤝 Manutenção

**Revisão trimestral:**
- [ ] Verificar documentos marcados como ⚠️ Desatualizado
- [ ] Atualizar métricas de documentação
- [ ] Arquivar documentos obsoletos em `/docs/archive/`

**Última revisão:** 2025-11-10
