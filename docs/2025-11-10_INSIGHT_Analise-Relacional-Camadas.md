# Análise Relacional em Camadas - Visão para v3.0

**Data:** 2025-11-10  
**Categoria:** INSIGHT  
**Status:** 📋 Planejado para v3.0  
**Autor:** Paulo Pons + GitHub Copilot (Claude Sonnet 4.5)

---

## 🎯 Contexto

Durante a sessão de desenvolvimento do sistema de histórico (v2.0), Paulo teve um insight crucial sobre como aprofundar as análises do TalkerApp: **análise relacional em múltiplas camadas**, onde dados estatísticos são vinculados a objetos (pessoas, lugares, eventos) para revelar correlações ocultas.

---

## 💡 Insight Original (Transcrição)

> "A partir da descrição de elementos em cenários estatísticos, podemos submeter a própria estatística à análise relacional, onde números são vinculados a objetos. Por exemplo: 'Você menciona ansiedade em 66% das suas reflexões'. Ao aprofundar a análise dos mesmos dados em uma ou duas camadas, sem sair do texto declarado, pode-se continuar: '...ansiedade em 66% das suas reflexões. Alguns elementos aparecem com mais frequência nestes relatos, como seu projeto finalizado que entrou há três meses. Este assunto é percebido cinco vezes mais em reflexões suas onde a palavra ansiedade é mencionada do que em outras. O nome Jorge Alba também surge com uma frequência maior em 50% nestes registros, embora a participação dele na sua narrativa seja relacionada a sentimentos positivos, como confiança e tranquilidade. Se quiser saber quais elementos são mais relacionados às suas reflexões onde ansiedade é um dos termos mais presentes, posso produzir um gráfico que contenha apenas estes 66% de reflexões.' Por isso os dados relacionados que mencionei. Pode-se ir uma camada mais a fundo, depois outra, e por alteração de filtros e seleção de objetos (nomes, lugares, tópicos), gerar diferentes tabelas e descobrir potenciais padrões a serem observados, elaborados e trabalhados para reorientação do usuário."
> 
> — Paulo Pons, 2025-11-10

---

## 🏗️ Arquitetura Conceitual

### **Camadas de Análise**

```
┌─────────────────────────────────────────────────────────┐
│  CAMADA 0: Análise Básica (v2.0 - Implementada)        │
│  "Você menciona 'ansiedade' em 66% das reflexões"      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  CAMADA 1: Correlação com Entidades                     │
│  "Quando menciona 'ansiedade', 'projeto X' aparece 5x   │
│   mais frequentemente do que em outras reflexões"       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  CAMADA 2: Análise de Valência Emocional               │
│  "'Jorge Alba' aparece em 50% dessas reflexões,         │
│   mas associado a sentimentos positivos                 │
│   (confiança, tranquilidade)"                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  CAMADA 3: Insights Acionáveis                          │
│  "Padrão identificado: 'projeto X' é gatilho de         │
│   ansiedade, mas 'Jorge Alba' é fator protetor.         │
│   Considere envolvê-lo mais no projeto."                │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Modelo de Dados Relacional

### **Novas Tabelas Necessárias**

```sql
-- Entidades extraídas das reflexões (pessoas, lugares, eventos)
CREATE TABLE entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'person', 'place', 'event', 'topic'
  first_mentioned DATETIME,
  frequency INTEGER DEFAULT 1
);

-- Relacionamento entre sessões e entidades
CREATE TABLE session_entities (
  session_id INTEGER NOT NULL,
  entity_id INTEGER NOT NULL,
  context TEXT, -- Frase onde foi mencionado
  emotional_valence REAL, -- -1 (negativo) a +1 (positivo)
  PRIMARY KEY (session_id, entity_id),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
);

-- Correlações entre entidades e emoções/temas
CREATE TABLE entity_correlations (
  entity_id INTEGER NOT NULL,
  theme_id INTEGER NOT NULL,
  co_occurrence_count INTEGER DEFAULT 1,
  avg_emotional_valence REAL,
  correlation_strength REAL, -- 0.0 a 1.0
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
  PRIMARY KEY (entity_id, theme_id)
);

-- Gatilhos emocionais identificados
CREATE TABLE emotional_triggers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id INTEGER NOT NULL,
  trigger_type TEXT NOT NULL, -- 'positive', 'negative', 'ambivalent'
  evidence_count INTEGER DEFAULT 1,
  avg_ocean_neuroticism REAL,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
);
```

---

## 🔍 Queries de Análise Relacional

### **Camada 1: Co-ocorrência de Entidades com Temas**

```sql
-- Quais entidades aparecem mais quando "ansiedade" é mencionada?
SELECT 
  e.name,
  e.type,
  COUNT(*) as occurrences,
  AVG(se.emotional_valence) as avg_valence
FROM entities e
JOIN session_entities se ON e.id = se.entity_id
JOIN session_themes st ON se.session_id = st.session_id
JOIN themes t ON st.theme_id = t.id
WHERE t.name = 'ansiedade'
GROUP BY e.id
ORDER BY occurrences DESC;
```

**Resultado Exemplo:**
```
| name              | type    | occurrences | avg_valence |
|-------------------|---------|-------------|-------------|
| Projeto X         | event   | 8           | -0.7        |
| Jorge Alba        | person  | 5           | +0.8        |
| Escritório        | place   | 6           | -0.4        |
```

**Insight gerado:**
> "Quando você menciona 'ansiedade', 'Projeto X' aparece 8 vezes (valência negativa -0.7), mas 'Jorge Alba' aparece 5 vezes com valência positiva +0.8, sugerindo que ele é um fator protetor neste contexto."

---

### **Camada 2: Comparação Contextual**

```sql
-- Comparar frequência de entidade em contexto específico vs. geral
WITH anxiety_sessions AS (
  SELECT DISTINCT s.id
  FROM sessions s
  JOIN session_themes st ON s.id = st.session_id
  JOIN themes t ON st.theme_id = t.id
  WHERE t.name = 'ansiedade'
),
entity_in_anxiety AS (
  SELECT entity_id, COUNT(*) as anxiety_count
  FROM session_entities
  WHERE session_id IN (SELECT id FROM anxiety_sessions)
  GROUP BY entity_id
),
entity_total AS (
  SELECT entity_id, COUNT(*) as total_count
  FROM session_entities
  GROUP BY entity_id
)

SELECT 
  e.name,
  COALESCE(eia.anxiety_count, 0) as in_anxiety,
  et.total_count as in_total,
  ROUND(CAST(eia.anxiety_count AS FLOAT) / et.total_count, 2) as ratio
FROM entities e
JOIN entity_total et ON e.id = et.entity_id
LEFT JOIN entity_in_anxiety eia ON e.id = eia.entity_id
WHERE eia.anxiety_count > 0
ORDER BY ratio DESC;
```

**Resultado Exemplo:**
```
| name       | in_anxiety | in_total | ratio |
|------------|------------|----------|-------|
| Projeto X  | 8          | 10       | 0.80  |
| Jorge Alba | 5          | 15       | 0.33  |
| Casa       | 3          | 20       | 0.15  |
```

**Insight gerado:**
> "'Projeto X' é mencionado em 80% das reflexões onde 'ansiedade' aparece, mas apenas 20% das outras reflexões. Isso sugere que este projeto é um gatilho emocional significativo."

---

### **Camada 3: Análise de Valência Emocional**

```sql
-- Identificar se entidade é gatilho positivo/negativo
SELECT 
  e.name,
  e.type,
  COUNT(*) as mentions,
  AVG(se.emotional_valence) as avg_valence,
  AVG(o.neuroticism) as avg_neuroticism,
  CASE 
    WHEN AVG(se.emotional_valence) > 0.3 THEN 'PROTETOR'
    WHEN AVG(se.emotional_valence) < -0.3 THEN 'GATILHO'
    ELSE 'NEUTRO'
  END as classification
FROM entities e
JOIN session_entities se ON e.id = se.entity_id
JOIN ocean_scores o ON se.session_id = o.session_id
GROUP BY e.id
HAVING mentions >= 3
ORDER BY avg_valence DESC;
```

**Resultado Exemplo:**
```
| name       | type   | mentions | avg_valence | avg_neuroticism | classification |
|------------|--------|----------|-------------|-----------------|----------------|
| Jorge Alba | person | 5        | +0.8        | 5.2             | PROTETOR       |
| Mãe        | person | 7        | +0.6        | 5.8             | PROTETOR       |
| Projeto X  | event  | 8        | -0.7        | 8.1             | GATILHO        |
| Chefe      | person | 4        | -0.5        | 7.5             | GATILHO        |
```

**Insight gerado:**
> "'Jorge Alba' é identificado como fator protetor (valência +0.8, N=5.2). Quando você fala dele, seu Neuroticism é 2.9 pontos menor que quando menciona 'Projeto X' (gatilho, valência -0.7, N=8.1)."

---

## 🎨 Interface de Usuário - Análise por Camadas

### **Mockup: Painel de Correlações**

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Análise Relacional: "ansiedade"                     │
├─────────────────────────────────────────────────────────┤
│  Encontrado em: 66% das reflexões (8 de 12 sessões)    │
│                                                         │
│  🏷️ Entidades Correlacionadas:                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [GATILHO]  Projeto X         ████████ 80%      │   │
│  │            Valência: -0.7    N médio: 8.1      │   │
│  │                                                 │   │
│  │ [NEUTRO]   Escritório        ████ 50%          │   │
│  │            Valência: -0.4    N médio: 6.8      │   │
│  │                                                 │   │
│  │ [PROTETOR] Jorge Alba        ██ 33%            │   │
│  │            Valência: +0.8    N médio: 5.2      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  💡 Insight Automatizado:                               │
│  "Projeto X" é um gatilho consistente de ansiedade.    │
│  Considere envolver "Jorge Alba" (fator protetor) mais │
│  frequentemente neste contexto.                         │
│                                                         │
│  [📊 Ver Gráfico] [🔽 Filtrar por Período] [💾 Export] │
└─────────────────────────────────────────────────────────┘
```

### **Visualização: Grafo de Relações**

```
        (Ansiedade)
          /  |  \
         /   |   \
        /    |    \
       /     |     \
[Projeto X] [Escritório] [Jorge Alba]
  ⚠️ -0.7    ⚪ -0.4      ✅ +0.8
  
  Legenda:
  ⚠️  = Gatilho emocional (valência negativa)
  ⚪  = Neutro
  ✅  = Fator protetor (valência positiva)
  
  Espessura da linha = força da correlação
```

---

## 🛠️ Implementação Técnica

### **Fase 1: Extração de Entidades (NER)**

```typescript
// lib/entity-extraction.ts

import Anthropic from '@anthropic-ai/sdk';

export async function extractEntities(text: string) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const prompt = `
  Analise o texto abaixo e extraia todas as entidades nomeadas nas seguintes categorias:
  - PERSON (pessoas)
  - PLACE (lugares)
  - EVENT (eventos importantes)
  
  Para cada entidade, identifique também a valência emocional associada (-1 a +1).
  
  Texto: ${text}
  
  Retorne em formato JSON:
  {
    "entities": [
      {"name": "Jorge Alba", "type": "person", "valence": 0.8, "context": "..."},
      {"name": "Projeto X", "type": "event", "valence": -0.7, "context": "..."}
    ]
  }
  `;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
}
```

### **Fase 2: Análise de Correlação**

```typescript
// lib/correlation-analysis.ts

export function calculateCorrelation(
  entityId: number,
  themeId: number
): CorrelationResult {
  const db = getDatabase();
  
  // Co-ocorrência
  const coOccurrence = db.prepare(`
    SELECT COUNT(*) as count
    FROM session_entities se
    JOIN session_themes st ON se.session_id = st.session_id
    WHERE se.entity_id = ? AND st.theme_id = ?
  `).get(entityId, themeId);

  // Frequência total da entidade
  const totalEntity = db.prepare(`
    SELECT COUNT(*) as count
    FROM session_entities
    WHERE entity_id = ?
  `).get(entityId);

  // Frequência total do tema
  const totalTheme = db.prepare(`
    SELECT COUNT(*) as count
    FROM session_themes
    WHERE theme_id = ?
  `).get(themeId);

  // Força da correlação (lift)
  const expected = (totalEntity.count * totalTheme.count) / getTotalSessions();
  const lift = coOccurrence.count / expected;

  return {
    co_occurrence: coOccurrence.count,
    correlation_strength: lift,
    significance: lift > 1.5 ? 'high' : lift > 1.2 ? 'medium' : 'low'
  };
}
```

### **Fase 3: Interface Interativa**

```typescript
// components/CorrelationExplorer.tsx

export default function CorrelationExplorer({ themeId }: Props) {
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const loadCorrelations = async () => {
    const response = await fetch(`/api/correlations?theme_id=${themeId}`);
    const data = await response.json();
    setCorrelations(data);
  };

  return (
    <div>
      <h2>Entidades Correlacionadas com {themeName}</h2>
      
      {correlations.map(corr => (
        <div key={corr.entity.id} onClick={() => setSelectedEntity(corr.entity)}>
          <EntityCard
            entity={corr.entity}
            correlation={corr.strength}
            valence={corr.avg_valence}
            classification={corr.classification}
          />
        </div>
      ))}

      {selectedEntity && (
        <EntityDetailPanel entity={selectedEntity} />
      )}
    </div>
  );
}
```

---

## 🎯 Casos de Uso

### **Caso 1: Identificar Gatilhos de Ansiedade**

**Pergunta do usuário:**
> "Por que eu fico ansioso? O que causa isso?"

**Análise do sistema:**
1. Busca todas as sessões onde "ansiedade" é mencionada
2. Extrai entidades mais frequentes nessas sessões
3. Compara com frequência geral
4. Identifica "Projeto X" como gatilho (ratio 0.80)

**Resposta gerada:**
> "Em 80% das reflexões onde você menciona ansiedade, 'Projeto X' também aparece. Isso sugere que este projeto é um gatilho emocional significativo. Quando você fala sobre ele, seu Neuroticism médio é 8.1/10, comparado a 6.2/10 em outras reflexões."

---

### **Caso 2: Descobrir Fatores Protetores**

**Pergunta do usuário:**
> "Quem me ajuda a ficar mais calmo?"

**Análise do sistema:**
1. Identifica reflexões com baixo Neuroticism (< 5.0)
2. Extrai pessoas mencionadas nessas reflexões
3. Calcula valência emocional associada a cada pessoa

**Resposta gerada:**
> "'Jorge Alba' aparece em 60% das suas reflexões com baixo Neuroticism, sempre com valência positiva (+0.8). Palavras associadas a ele: 'confiança', 'tranquilidade', 'apoio'. Considere conversar mais com ele quando estiver ansioso."

---

### **Caso 3: Análise Temporal de Relacionamentos**

**Pergunta do usuário:**
> "Meu relacionamento com minha mãe melhorou ou piorou?"

**Análise do sistema:**
1. Busca menções a "mãe" ao longo do tempo
2. Analisa valência emocional em cada período
3. Cruza com scores OCEAN

**Resposta gerada:**
> "Nos últimos 90 dias, a valência emocional associada a 'mãe' aumentou de -0.2 para +0.5. Seu Agreeableness médio ao falar dela subiu de 6.0 para 7.5. Padrão positivo detectado!"

---

## 🚀 Roadmap de Implementação

### **Fase 1: Fundação (Sprint 1-2)**
- [ ] Criar tabelas `entities`, `session_entities`, `entity_correlations`
- [ ] Implementar extração de entidades via Claude
- [ ] Criar API `/api/entities` (CRUD)
- [ ] Testar extração com 10 sessões reais

### **Fase 2: Análise Básica (Sprint 3-4)**
- [ ] Implementar cálculo de co-ocorrência
- [ ] Query para correlação entidade ↔ tema
- [ ] Query para classificação gatilho/protetor
- [ ] Interface básica de listagem de correlações

### **Fase 3: Visualizações (Sprint 5-6)**
- [ ] Componente `CorrelationExplorer.tsx`
- [ ] Gráfico de barras de entidades correlacionadas
- [ ] Grafo de relações (usando react-force-graph ou vis.js)
- [ ] Filtros dinâmicos (por período, tipo de entidade)

### **Fase 4: Insights Avançados (Sprint 7-8)**
- [ ] Algoritmo de detecção de gatilhos
- [ ] Algoritmo de identificação de fatores protetores
- [ ] Geração automática de frases-insights
- [ ] Sugestões acionáveis para o usuário

### **Fase 5: Exportação e Relatórios (Sprint 9)**
- [ ] Export de análises em PDF
- [ ] Relatórios mensais automáticos
- [ ] Compartilhamento de insights com terapeuta (opcional)

---

## 📊 Métricas de Sucesso

### **Qualitativas:**
- [ ] Usuário descobre insights que não perceberia sozinho
- [ ] Insights geram perguntas reflexivas novas
- [ ] Usuário ajusta comportamentos baseado em correlações

### **Quantitativas:**
- [ ] 80% de precisão na extração de entidades
- [ ] Correlações com lift > 1.5 são estatisticamente significativas
- [ ] Tempo de resposta < 2s para análises complexas

---

## 🔮 Visão de Longo Prazo

### **v4.0 - Aprendizado de Máquina**
- Treinar modelo para predizer emoções futuras baseado em entidades
- "Se você encontrar com X e falar sobre Y, há 70% de chance de sentir Z"

### **v5.0 - Recomendações Personalizadas**
- "Baseado em seus padrões, sugerimos conversar com Jorge antes da reunião sobre Projeto X"

### **v6.0 - Integração com Calendário**
- Correlacionar eventos externos (reuniões, datas) com estados emocionais
- "Você fica 30% mais ansioso nas segundas-feiras"

---

## 🤝 Contribuições

- **Paulo Pons:** Visão original de análise relacional em camadas
- **GitHub Copilot (Claude Sonnet 4.5):** Estruturação técnica e SQL

---

## 📅 Histórico de Alterações

**2025-11-10:** Documento criado a partir do insight de Paulo durante desenvolvimento v2.0
