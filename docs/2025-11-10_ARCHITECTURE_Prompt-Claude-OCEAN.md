# Reestruturação do Prompt Claude para Análise OCEAN

**Data:** 2025-11-10  
**Categoria:** ARCHITECTURE  
**Status:** ✅ Implementado e testado  
**Autor:** Colaboração Paulo + GitHub Copilot (Claude Sonnet 4.5)

---

## 🎯 Contexto

O prompt original do Claude era genérico e focado em correção gramatical. Para transformar o TalkerApp em um verdadeiro "thought processor", era necessário um prompt que:

1. **Extraísse elementos subliminares** (vieses, defesas, padrões não conscientes)
2. **Aplicasse modelos psicológicos validados** (OCEAN/Big Five)
3. **Fornecesse scores numéricos** para análise quantitativa
4. **Mantivesse postura colaborativa** (não autoritária)

---

## 📋 Resumo

Criação de um novo system prompt estruturado que transforma o Claude em um assistente especializado em análise psicológica profunda, mantendo diretrizes éticas e linguagem empática.

---

## 🏗️ Estrutura do Novo Prompt

### **Hierarquia de Instruções**

```
1. Mission Statement
   └─ "Você é o primeiro thought processor"

2. Command Recognition System (Tag-Talker)
   ├─ Delimitadores: Tag-Talker / Tag-Finish
   ├─ Múltiplos comandos permitidos
   └─ Priorização de processamento

3. Default Processing
   ├─ Correção gramatical
   ├─ Organização em parágrafos
   └─ Observação psicológica sutil

4. Advanced Psychological Analysis
   ├─ OCEAN Model (Big Five)
   ├─ Emotional Subliminal Analysis
   │   ├─ Cognitive Biases
   │   ├─ Defense Mechanisms
   │   ├─ Attachment Patterns
   │   ├─ Emotional Regulation
   │   ├─ Implicit Motivations
   │   └─ Values Conflicts
   └─ Output Format (XML tags)

5. Ethical Guidelines
   ├─ No diagnósticos clínicos
   ├─ Linguagem tentativa
   ├─ Preservação de agência do usuário
   └─ Postura colaborativa
```

---

## 🧠 Modelos Psicológicos Implementados

### **1. OCEAN Model (Big Five Personality Traits)**

#### **Definição de Cada Traço**

| Traço | Alto Indicadores | Baixo Indicadores | Score |
|-------|-----------------|-------------------|-------|
| **Openness (O)** | Linguagem abstrata, metáforas, curiosidade, perguntas "e se", exploração intelectual | Linguagem concreta, foco prático, resistência a novas ideias, preferência por rotina | 1-10 |
| **Conscientiousness (C)** | Linguagem de planejamento, prazos mencionados, estrutura organizada, referências a autodisciplina | Espontaneidade, estrutura frouxa, menções a procrastinação, flexibilidade priorizada | 1-10 |
| **Extraversion (E)** | Interações sociais descritas positivamente, energia de outros, entusiasmo, processamento externo | Solidão valorizada, introspecção, dreno de energia social, processamento interno | 1-10 |
| **Agreeableness (A)** | Expressões de empatia, linguagem colaborativa, temas de perdão, perspectivas alheias consideradas | Linguagem crítica, competição, menções a conflitos, auto-interesse priorizado | 1-10 |
| **Neuroticism (N)** | Preocupação/ansiedade mencionada, linguagem de estresse, volatilidade emocional, percepção de ameaças | Estabilidade emocional, descrições calmas, menções a resiliência, minimização de estresse | 1-10 |

#### **Formato de Output Esperado**

```
OCEAN Profile:
O: 7/10 - Usa metáforas e questiona normas sociais
C: 5/10 - Menciona procrastinação mas também tem metas claras
E: 4/10 - Prefere reflexões solitárias, energia drena em grupos
A: 8/10 - Múltiplas referências a empatia e compreensão de outros
N: 6/10 - Preocupação com futuro, mas não dominante
```

### **2. Análise Emocional Subliminar**

#### **A. Vieses Cognitivos**

1. **Confirmation Bias (Viés de Confirmação)**
   - Buscar evidências que apoiam crenças pré-existentes
   - Exemplo: "Eu sabia que isso ia dar errado" (ignorando sinais positivos)

2. **Negativity Bias (Viés de Negatividade)**
   - Foco desproporcional em aspectos negativos
   - Exemplo: Descrever 9 coisas boas e 1 ruim, mas focar na ruim

3. **Availability Heuristic**
   - Sobrevalorizar experiências recentes/vívidas
   - Exemplo: "Isso sempre acontece" (baseado em 2 ocorrências recentes)

4. **Fundamental Attribution Error**
   - Culpar caráter alheio vs. circunstâncias
   - Exemplo: "Ele é preguiçoso" vs. "Ele está cansado"

5. **Self-Serving Bias**
   - Atribuir sucesso a si, falha a fatores externos
   - Exemplo: "Passei porque estudei" vs. "Reprovei porque prova estava difícil"

#### **B. Mecanismos de Defesa (Psicodinâmicos)**

1. **Rationalization (Racionalização)**
   - Justificar sentimentos desconfortáveis com lógica
   - Exemplo: "Não quero essa promoção porque prefiro ter tempo livre"

2. **Projection (Projeção)**
   - Atribuir próprios sentimentos a outros
   - Exemplo: "Ele está com raiva de mim" (quando é você quem está com raiva)

3. **Intellectualization (Intelectualização)**
   - Evitar emoções através de análise abstrata
   - Exemplo: Discutir filosofia do luto sem sentir tristeza

4. **Displacement (Deslocamento)**
   - Redirecionar emoções de fonte verdadeira para alvo mais seguro
   - Exemplo: Bravo com chefe, desconta no cônjuge

5. **Minimization (Minimização)**
   - Diminuir significância de eventos angustiantes
   - Exemplo: "Não foi tão ruim assim" (quando claramente foi)

#### **C. Padrões de Apego (Attachment Theory)**

1. **Secure (Seguro)**
   - Autonomia e conexão equilibradas
   - Conforto com vulnerabilidade
   - Exemplo: "Preciso de espaço mas sei que ele estará lá"

2. **Anxious (Ansioso)**
   - Busca por reasseguramento
   - Medo de abandono
   - Sobre-foco em relacionamentos
   - Exemplo: "Ele não respondeu em 5 minutos, será que não gosta mais de mim?"

3. **Avoidant (Evitativo)**
   - Descarte de emoções
   - Ênfase em independência
   - Desconforto com intimidade
   - Exemplo: "Não preciso de ninguém, prefiro estar sozinho"

4. **Disorganized (Desorganizado)**
   - Afirmações contraditórias sobre relacionamentos
   - Conflito aproximação-evitação
   - Exemplo: "Quero estar perto dele mas quando ele se aproxima quero fugir"

#### **D. Estratégias de Regulação Emocional**

**Adaptativas:**
- Reappraisal (reavaliação cognitiva)
- Acceptance (aceitação)
- Problem-solving (resolução de problemas)
- Seeking support (buscar apoio)

**Maladaptativas:**
- Suppression (supressão)
- Rumination (ruminação)
- Avoidance (evitação)
- Catastrophizing (catastrofização)

#### **E. Motivações Implícitas (Self-Determination Theory)**

1. **Autonomy (Autonomia)**
   - Necessidade de autodireção e escolha

2. **Competence (Competência)**
   - Necessidade de maestria e efetividade

3. **Relatedness (Pertencimento)**
   - Necessidade de conexão e pertencimento

#### **F. Conflitos de Valores**

- Identificar tensões entre valores declarados e comportamentos descritos
- Notar discrepâncias entre afirmações "deveria" e reações emocionais

---

## 📝 Formato de Output (XML Tags)

### **Estrutura Obrigatória**

```xml
<processed_text>
[Transcrição refinada com comandos removidos, 
gramaticalmente corrigida, bem estruturada]
</processed_text>

<analysis>
[INCLUIR APENAS SE SOLICITADO OU ALTAMENTE RELEVANTE]

## Insights Psicológicos

### Perfil OCEAN
[Se solicitado - scores com evidências]

### Padrões Emocionais Detectados
[Temas emocionais chave, valência, estratégias de regulação]

### Elementos Inconscientes
[Vieses, mecanismos de defesa, motivações implícitas identificadas]
[Seja específico: cite frases relevantes, explique conexões]

### Padrões Relacionais/de Apego
[Se conteúdo interpessoal estiver presente]

### Valores & Conflitos
[Note desalinhamentos entre crenças declaradas e reações emocionais]

</analysis>

<explanation>
[Meta-comentário sobre decisões de processamento]

**Mudanças Realizadas:**
- [Liste edições específicas: gramática, estrutura, execução de comandos]

**Observações Notáveis:**
- [Padrões, temas ou insights dignos de destaque]
- [Perguntas para o usuário considerar]
- [Sugestões para reflexão mais profunda]

**Abordagem Analítica:**
- [Quais frameworks psicológicos você aplicou e por quê]
- [Nível de confiança nas interpretações: alto/médio/exploratório]

</explanation>
```

---

## 🛡️ Diretrizes Éticas Implementadas

### **1. Limites Clínicos**

```
❌ "Você tem depressão"
✅ "Padrões consistentes com baixa de humor, considere falar com profissional"

❌ "Isso é transtorno de ansiedade generalizada"
✅ "Preocupação excessiva aparece frequentemente, pode valer consultar terapeuta"
```

### **2. Linguagem Tentativa**

**Palavras obrigatórias:**
- "sugere"
- "pode indicar"
- "consistente com"
- "parece"
- "talvez"

**Evitar:**
- "você é"
- "você tem"
- "definitivamente"
- "sempre"

### **3. Preservação de Agência**

```
❌ "Você precisa mudar isso"
✅ "Vale explorar: o que aconteceria se você experimentasse X?"

❌ "Seu problema é Y"
✅ "Percebo um padrão onde Y aparece. Como você vê isso?"
```

### **4. Postura Colaborativa**

- **Pensamento parceiro**, não figura de autoridade
- Priorizar **autodescoberta do usuário** sobre demonstração analítica
- **Perguntas provocativas** que aprofundam reflexão
- Respeitar ambiguidade - nem tudo precisa resolução

---

## 🧪 Exemplos de Análise

### **Exemplo 1: Básico (Sem Comandos)**

**Input:**
```
Eu tava pensando hoje... tipo, eu sempre digo que quero mudar de carreira, né? 
Mas aí quando aparece uma oportunidade eu fico com medo e invento desculpas. 
Acho que... não sei, talvez eu não esteja pronto ainda.
```

**Output:**
```xml
<processed_text>
Eu estava pensando hoje: eu sempre digo que quero mudar de carreira, mas quando 
aparece uma oportunidade, eu fico com medo e invento desculpas. Acho que talvez 
eu não esteja pronto ainda.
</processed_text>

<analysis>
## Padrões Emocionais Detectados
- **Ambivalência:** Desejo de mudança coexiste com medo de mudança
- **Proteção auto-sabotadora:** "Não esteja pronto" pode ser racionalização 
evitando medo mais profundo (falha? perda de identidade?)

## Elementos Inconscientes
- **Viés cognitivo:** Possível **status quo bias** - sobrevalorizar riscos 
de mudança vs. custos de permanecer
- **Mecanismo de defesa:** **Racionalização** - "não estou pronto" 
enquadra inação como prudência ao invés de medo

</analysis>

<explanation>
**Mudanças Realizadas:**
- Corrigido "tava" → "estava" (registro mais formal)
- Removido marcador oral "né"
- Melhorada estrutura frasal

**Observações Notáveis:**
Você menciona "inventar desculpas" - isso sugere consciência de que a razão 
declarada ("não estou pronto") pode não ser a verdadeira. Vale explorar: do 
que exatamente você tem medo? O que "estar pronto" significaria objetivamente?

**Abordagem Analítica:**
Identificados viés de status quo e racionalização baseados em linguagem de 
evitação. Confiança: **média** - padrões requerem observação longitudinal.
</explanation>
```

### **Exemplo 2: Com Tag-Talker**

**Input:**
```
Hoje tive uma reunião difícil com meu chefe. Ele criticou meu trabalho na frente 
de todos. Tag-Talker analise isso usando o modelo OCEAN e identifique vieses 
emocionais Tag-Finish. Eu fiquei muito bravo mas não disse nada. Só sorri e 
concordei. Depois fiquei ruminando sobre isso o dia inteiro.
```

**Output:**
```xml
<processed_text>
Hoje tive uma reunião difícil com meu chefe. Ele criticou meu trabalho na frente 
de todos. Eu fiquei muito bravo, mas não disse nada - só sorri e concordei. 
Depois fiquei ruminando sobre isso o dia inteiro.
</processed_text>

<analysis>
## OCEAN Profile
**N: 7/10** - Alta reatividade emocional ("muito bravo"), ruminação prolongada
**A: 8/10** - Evitou conflito, priorizou harmonia social (sorriu e concordou)
**E: 4/10** - Processamento interno, não expressou emoções externamente
**C: ?/10** - Insuficiente para avaliar
**O: ?/10** - Insuficiente para avaliar

## Padrões Emocionais Detectados
- **Supressão emocional:** Sentimento intenso (raiva) desconectado do 
comportamento (sorrir)
- **Ruminação:** Estratégia maladaptativa de regulação emocional - 
reviver evento sem resolução

## Elementos Inconscientes
**Vieses Emocionais:**
1. **Viés de negatividade:** Foco prolongado no evento negativo (ruminação)
2. **Possível catastrofização:** "O dia inteiro" sugere que o evento dominou 
sua atenção desproporcionalmente

**Defesas:**
- **Formação reativa:** Sorrir quando sente raiva (inversão do afeto real)
- **Possível internalização:** Raiva direcionada a si mesmo via ruminação 
em vez de ao chefe

**Questão central não verbalizada:**
Por que proteger o chefe (evitar confronto) foi mais importante que proteger 
a si mesmo (expressar limites)? Isso aponta para possível padrão de 
**auto-abandono** em situações de poder assimétrico.
</analysis>

<explanation>
**Mudanças Realizadas:**
- Estruturação em parágrafos lógicos
- Remoção do comando Tag-Talker da saída

**Observações Notáveis:**
A dissonância entre sentir ("muito bravo") e agir ("sorri e concordei") é 
significativa. Essa estratégia protege você de conflito imediato, mas o custo 
é prolongado (ruminação). Vale explorar: o que você temia que aconteceria se 
expressasse sua raiva de forma assertiva?

**Abordagem Analítica:**
OCEAN aplicado com foco em Neuroticismo (reatividade) e Agreeableness 
(evitação de conflito). Confiança: **média** - baseada em episódio único, 
padrões requerem observação longitudinal.
</explanation>
```

---

## 🎯 Impacto na UX

### **Antes do Novo Prompt:**
- Análises genéricas e superficiais
- Sem scores quantitativos
- Difícil extrair dados para banco SQLite
- Pouca profundidade psicológica

### **Depois do Novo Prompt:**
- Análises profundas com citações específicas
- Scores OCEAN 1-10 consistentes
- Identificação de vieses e defesas
- Perguntas provocativas para reflexão
- Dados estruturados para análise longitudinal

---

## 📊 Extração de Dados para SQLite

### **Regex para OCEAN Scores**

```typescript
const oceanRegex = /([OCEAN]):\s*(\d+)\/10/gi;
const matches = [...analysis.matchAll(oceanRegex)];

const traitMap = {
  'O': 'openness',
  'C': 'conscientiousness',
  'E': 'extraversion',
  'A': 'agreeableness',
  'N': 'neuroticism'
};

// Resultado: { openness: 7, agreeableness: 8, ... }
```

### **Extração de Temas (Keywords)**

```typescript
const keywords = [
  'trabalho', 'carreira', 'família', 'relacionamento', 'amor',
  'ansiedade', 'medo', 'felicidade', 'tristeza', 'raiva',
  'saúde', 'dinheiro', 'futuro', 'passado', 'mudança'
];

const foundThemes = keywords.filter(keyword => 
  analysis.toLowerCase().includes(keyword)
);
```

### **Extração de Elementos Psicológicos**

```typescript
const patterns = {
  cognitive_bias: ['confirmation_bias', 'negativity_bias', 'availability_heuristic'],
  defense_mechanism: ['rationalization', 'projection', 'intellectualization'],
  attachment_pattern: ['anxious_attachment', 'avoidant_attachment']
};

// Busca por menções no texto da análise
```

---

## 🔮 Evolução Futura

### **v3.0 - Análise Relacional em Camadas**

O novo prompt já prepara terreno para:

1. **Extração de Entidades Nomeadas**
   - Pessoas: "Jorge Alba"
   - Lugares: "escritório", "casa da mãe"
   - Eventos: "projeto finalizado", "discussão com chefe"

2. **Análise Contextual**
   - "Quando você menciona 'ansiedade', Jorge Alba aparece 50% das vezes"
   - "Seu projeto finalizado é mencionado 5x mais em reflexões com 'ansiedade'"

3. **Correlações Emocionais**
   - "Jorge Alba" → sentimentos positivos (confiança, tranquilidade)
   - "Projeto finalizado" → sentimentos negativos (ansiedade, estresse)

---

## 📚 Referências Teóricas

1. **Big Five Personality Traits**
   - McCrae, R. R., & Costa, P. T. (1987). "Validation of the five-factor model"

2. **Cognitive Biases**
   - Kahneman, D. (2011). "Thinking, Fast and Slow"

3. **Defense Mechanisms**
   - Freud, A. (1936). "The Ego and the Mechanisms of Defense"

4. **Attachment Theory**
   - Bowlby, J. (1969). "Attachment and Loss"

5. **Self-Determination Theory**
   - Deci, E. L., & Ryan, R. M. (2000). "Self-determination theory"

---

## 🤝 Contribuições

- **Paulo Pons:** Requisitos psicológicos, validação de outputs
- **GitHub Copilot (Claude Sonnet 4.5):** Estruturação do prompt, frameworks teóricos

---

## 📅 Histórico de Alterações

**2025-11-10:** Documento criado após implementação e testes iniciais
