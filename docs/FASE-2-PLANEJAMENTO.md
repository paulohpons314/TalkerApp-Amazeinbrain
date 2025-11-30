# 🚀 TalkerApp - Planejamento Fase 2

**Data**: 14/11/2025  
**Status**: 📋 Planejamento

---

## 🎯 **Objetivo da Fase 2**

Transformar o TalkerApp de **ferramenta de análise pontual** para **sistema de insight longitudinal** com capacidade de revelar padrões ao longo do tempo, comparar sessões e gerar compreensão profunda através de dados agregados.

---

## 🧠 **Features Prioritárias (Em Ordem)**

### 1. **"Caixa de Correio" - Registro Sem Análise Imediata** 🔴 **Alta Prioridade**

#### Problema
- Usuário pode querer apenas registrar pensamentos sem análise
- Upload em lote de áudios acumulados não deve gerar 50 chamadas ao Claude
- Custo de API desnecessário
- Análise imediata pode inibir honestidade

#### Solução Proposta
```typescript
interface RecordingOptions {
  transcribe: boolean;  // true = Whisper agora
  analyze: boolean;     // true = Claude agora
  saveRaw: boolean;     // true = salva blob do áudio
}

// UI: Radio buttons ou checkboxes
○ Transcrever e Analisar (padrão)
○ Apenas Transcrever
○ Salvar sem Transcrever (áudio bruto)
```

#### Fluxos
1. **Análise Imediata** (atual): Gravar → Whisper → Claude → Resultado
2. **Apenas Transcrever**: Gravar → Whisper → Salvar → Analisar depois
3. **Áudio Bruto**: Gravar → Salvar blob → Transcrever + Analisar depois

#### Interface
```tsx
<div className="flex gap-2 mb-4">
  <label>
    <input type="radio" name="mode" value="full" defaultChecked />
    🔍 Analisar agora
  </label>
  <label>
    <input type="radio" name="mode" value="transcribe" />
    📝 Apenas transcrever
  </label>
  <label>
    <input type="radio" name="mode" value="raw" />
    💾 Salvar sem processar
  </label>
</div>
```

#### Banco de Dados
```sql
ALTER TABLE sessions ADD COLUMN audio_blob BLOB;
ALTER TABLE sessions ADD COLUMN processing_status TEXT DEFAULT 'pending';
-- 'pending' | 'transcribed' | 'analyzed'
```

#### Histórico
- Botão "Analisar agora" em sessões com status `pending` ou `transcribed`
- Batch processing: "Analisar todas pendentes"

---

### 2. **Análise Longitudinal** 🟠 **Média-Alta Prioridade**

#### Objetivo
Identificar evolução de padrões ao longo do tempo.

#### Features
- **Timeline de OCEAN scores**
  ```
  Openness:         [7]──[8]──[6]──[7]──[9]
  Conscientiousness:[5]──[5]──[6]──[7]──[8] ↗️ Tendência positiva
  ```

- **Gráficos de evolução**
  - Line charts (Recharts)
  - Heatmaps de temas recorrentes
  - Frequência de elementos psicológicos

- **Métricas agregadas**
  - Média móvel de scores
  - Desvio padrão (estabilidade emocional)
  - Picos e vales (eventos significativos)

#### Implementação
```typescript
// lib/analytics.ts
export function getOceanTimeline(userId: string, days: number) {
  // Query últimos N dias
  // Retorna array de {date, scores}
}

export function getTrendAnalysis(timeline: OceanTimeline[]) {
  // Calcula tendências (regressão linear simples)
  // Identifica mudanças significativas
}
```

---

### 3. **Comparação Entre Sessões** 🟠 **Média Prioridade**

#### Use Cases
- "Como meu pensamento mudou sobre [tema X]?"
- "Minha ansiedade aumentou nas últimas 2 semanas?"
- "Diferenças entre sessões de manhã vs noite?"

#### Features
- **Comparador side-by-side**
  ```
  ┌────────────────┬────────────────┐
  │  Sessão 1      │   Sessão 2     │
  │  12/11/2025    │   14/11/2025   │
  ├────────────────┼────────────────┤
  │  Temas:        │   Temas:       │
  │  - Trabalho    │   - Trabalho   │
  │  - Ansiedade   │   - Família    │
  │                │                │
  │  OCEAN:        │   OCEAN:       │
  │  N: 7/10 ⚠️    │   N: 4/10 ✅   │
  └────────────────┴────────────────┘
  ```

- **Diff de análises**
  - Highlight de mudanças significativas
  - Temas novos/ausentes
  - Shifts em personalidade

- **Clustering automático**
  - "Sessões similares a esta"
  - Agrupamento por temas
  - Identificação de padrões sazonais

---

### 4. **Visualização de Padrões** 🟡 **Média Prioridade**

#### Dashboard de Insights
```
┌─────────────────────────────────────────┐
│  📊 Seus Padrões (Últimos 30 dias)      │
├─────────────────────────────────────────┤
│  🔥 Temas mais frequentes:              │
│     1. Trabalho (12x)                   │
│     2. Relacionamento (8x)              │
│     3. Saúde (5x)                       │
│                                         │
│  🧠 Vieses cognitivos identificados:    │
│     • Confirmation bias (7x)            │
│     • Negativity bias (5x)              │
│                                         │
│  📈 Evolução OCEAN:                     │
│     [Gráfico de linhas]                 │
│                                         │
│  ⏰ Horários mais produtivos:           │
│     Manhã (6-10h): 70% positivo         │
│     Tarde (14-18h): 50% neutro          │
│     Noite (20-23h): 40% negativo        │
└─────────────────────────────────────────┘
```

#### Tecnologias
- **Recharts** para gráficos
- **D3.js** para visualizações avançadas (opcional)
- **Heatmap** para padrões temporais

---

### 5. **Exportação Estruturada** 🟡 **Média Prioridade**

#### Formatos
- **PDF** - Relatório formatado com gráficos
- **DOCX** - Editável no Word
- **JSON** - Dados brutos para análise externa
- **CSV** - Importar em Excel/Google Sheets

#### Template de Relatório
```markdown
# Relatório TalkerApp - [Período]

## Resumo Executivo
- Total de sessões: 15
- Palavras transcritas: 12.450
- Tempo de gravação: 2h 34min

## Análise OCEAN
[Gráficos]

## Temas Recorrentes
[Lista com frequências]

## Insights Principais
[Análises do Claude agregadas]

## Evolução Temporal
[Timeline]
```

---

### 6. **Conversa Direta com Claude Sobre Análise** 🟢 **Baixa-Média Prioridade**

#### Conceito
Botão "💬 Conversar sobre esta análise" que abre um chat contextual.

#### Implementação
```typescript
// Contexto enviado ao Claude
const context = {
  session: currentSession,
  analysis: previousAnalysis,
  userQuestion: "Por que você identificou confirmation bias aqui?"
};

// API call
const response = await anthropic.messages.create({
  model: "claude-sonnet-4",
  system: "Você é um assistente que ajuda o usuário a entender suas análises psicológicas...",
  messages: [
    { role: "assistant", content: previousAnalysis },
    { role: "user", content: userQuestion }
  ]
});
```

#### Features
- Histórico de conversação por sessão
- Contexto automático da análise original
- Perguntas sugeridas ("Saiba mais sobre X")

---

### 7. **Tags e Categorias Customizadas** 🟢 **Baixa Prioridade**

#### Objetivo
Permitir organização manual além da automática.

#### Features
- Tags livres (`#trabalho`, `#insight`, `#urgente`)
- Categorias predefinidas (Profissional, Pessoal, Reflexão, etc.)
- Filtros no histórico por tags
- Sugestão automática baseada em conteúdo

---

### 8. **Busca Full-Text e Semântica** 🟢 **Baixa Prioridade**

#### Full-Text Search (SQLite FTS5)
```sql
CREATE VIRTUAL TABLE sessions_fts USING fts5(
  transcription, 
  processed_text, 
  analysis
);

-- Busca
SELECT * FROM sessions_fts 
WHERE sessions_fts MATCH 'ansiedade OR medo';
```

#### Semantic Search (Futuro)
- Embeddings com OpenAI
- Vector database (Pinecone/Weaviate)
- "Encontre sessões sobre sentimento de inadequação" (sem usar a palavra)

---

## 🗓️ **Roadmap Sugerido**

### Sprint 1 (1-2 semanas)
- [ ] "Caixa de Correio" - Registro sem análise
- [ ] Refatoração de lógica de negócio
- [ ] API keys validation
- [ ] Memory leak fix

### Sprint 2 (2-3 semanas)
- [ ] Análise longitudinal básica
- [ ] Timeline de OCEAN scores
- [ ] Gráficos de evolução

### Sprint 3 (2-3 semanas)
- [ ] Comparação entre sessões
- [ ] Dashboard de insights
- [ ] Visualizações avançadas

### Sprint 4 (1-2 semanas)
- [ ] Exportação (PDF, DOCX, JSON)
- [ ] Tags customizadas
- [ ] Busca full-text

### Sprint 5 (Futuro)
- [ ] Conversa com Claude contextual
- [ ] Semantic search
- [ ] Mobile app (React Native?)
- [ ] Integrações (Calendar, Notion, etc.)

---

## 🔧 **Requisitos Técnicos (Fase 2)**

### Novas Dependências
```json
{
  "recharts": "^2.10.0",           // Gráficos
  "date-fns": "^3.0.0",            // Manipulação de datas
  "jspdf": "^2.5.0",               // Geração de PDF
  "docx": "^8.5.0",                // Geração de DOCX
  "zustand": "^4.4.0",             // State management (opcional)
  "react-query": "^5.0.0"          // Cache de queries (opcional)
}
```

### Migrations do Banco
```sql
-- Migration 001: Add processing status
ALTER TABLE sessions ADD COLUMN processing_status TEXT DEFAULT 'analyzed';
ALTER TABLE sessions ADD COLUMN audio_blob BLOB;
ALTER TABLE sessions ADD COLUMN tags TEXT; -- JSON array

-- Migration 002: Full-text search
CREATE VIRTUAL TABLE sessions_fts USING fts5(...);

-- Migration 003: Metadata expansion
ALTER TABLE sessions ADD COLUMN duration_seconds INTEGER;
ALTER TABLE sessions ADD COLUMN word_count INTEGER;
ALTER TABLE sessions ADD COLUMN sentiment_score REAL;
```

### Novos Endpoints
```
POST   /api/sessions/:id/analyze      # Analisar sessão pendente
POST   /api/sessions/:id/chat         # Conversa contextual
GET    /api/analytics/timeline        # Timeline de insights
GET    /api/analytics/compare         # Comparar sessões
GET    /api/analytics/patterns        # Padrões agregados
POST   /api/export                    # Exportar relatórios
```

---

## 🎨 **Wireframes Conceituais**

### Dashboard de Insights
```
┌────────────────────────────────────────────┐
│  TalkerApp - Insights                      │
├────────────────────────────────────────────┤
│  [Filtros: □ Últimos 7 dias ▼]            │
│                                            │
│  ┌──────────────┬──────────────┐          │
│  │ OCEAN Médio  │  Temas Top 5 │          │
│  │  O: 7.2      │  1. Trabalho │          │
│  │  C: 6.8      │  2. Família  │          │
│  │  ...         │  ...         │          │
│  └──────────────┴──────────────┘          │
│                                            │
│  📈 Evolução Temporal                      │
│  [Gráfico de linhas multi-séries]         │
│                                            │
│  🔍 Sessões Recentes                       │
│  • 14/11 - "Reflexão sobre trabalho"      │
│  • 12/11 - "Ansiedade sobre projeto"      │
│  • 10/11 - "Insight sobre relacionamento" │
└────────────────────────────────────────────┘
```

---

## 💡 **Insights Filosóficos - Fase 2**

### Do Individual ao Longitudinal

**Fase 1**: "Quem sou eu agora?"  
**Fase 2**: "Como estou me tornando?"

### Metacognição Expandida

Não apenas "pensar sobre o pensamento", mas **ver padrões no pensamento ao longo do tempo**.

### O Self como Processo

> "Você não é uma fotografia, é um filme."

Análise longitudinal revela:
- Trajetórias de mudança
- Ciclos e sazonalidades
- Gatilhos invisíveis
- Resiliência e adaptação

---

## 🚧 **Riscos e Mitigações**

### Risco 1: Overload de Dados
**Problema**: Muitas sessões = gráficos ilegíveis  
**Mitigação**: Agregação inteligente, filtros temporais, sampling

### Risco 2: Análise Superficial
**Problema**: Métricas sem contexto = números vazios  
**Mitigação**: Claude analisa também os *padrões* (meta-análise)

### Risco 3: Custo de API
**Problema**: Claude é caro  
**Mitigação**: Análises sob demanda, cache agressivo, batch processing

### Risco 4: Privacidade
**Problema**: Dados sensíveis acumulados  
**Mitigação**: Criptografia, self-hosting, exportação/deleção fácil

---

## ✅ **Critérios de Sucesso (Fase 2)**

1. **Usuário identifica padrões** que não veria manualmente
2. **Redução de 50%** no tempo para gerar relatórios de autoconhecimento
3. **Insights longitudinais** geram "aha moments" significativos
4. **NPS > 50** de usuários beta
5. **Uso semanal ativo** (não apenas pontual)

---

## 📝 **Próximos Passos Imediatos**

1. ✅ Documentar Fase 1 (este documento)
2. ⏳ Implementar "Caixa de Correio"
3. ⏳ Refatorar lógica de negócio
4. ⏳ Criar protótipo de dashboard
5. ⏳ Testar com 3-5 usuários beta

---

**Fase 2 transformará o TalkerApp de ferramenta pontual em companheiro de jornada de autoconhecimento.** 🚀
