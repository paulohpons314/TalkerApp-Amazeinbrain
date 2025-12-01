# 🧪 Guia de Teste - Sistema de Histórico com Visualizações

## 🎯 Objetivo do Teste

Validar a UX do "Thought Processor" através de 3 sessões de gravação e análise dos gráficos gerados.

---

## 📋 Roteiro de Teste

### **Sessão 1: Reflexão sobre Trabalho/Carreira**

**Sugestão de gravação:**
```
"Eu estava pensando sobre minha carreira hoje. Sinto que estou estagnado, 
mas ao mesmo tempo tenho medo de fazer mudanças. Tag-Talker analise isso 
usando o modelo OCEAN Tag-Finish. Quando aparece uma oportunidade nova, 
eu sempre invento desculpas para não tentar. Será que é medo de falhar 
ou medo de ter sucesso?"
```

**O que observar:**
- ✅ Transcrição precisa do áudio
- ✅ Remoção dos comandos Tag-Talker da saída
- ✅ Análise OCEAN com scores numéricos
- ✅ Identificação de vieses (racionalização, status quo bias)
- ✅ Salvamento automático no banco SQLite

---

### **Sessão 2: Reflexão sobre Relacionamentos**

**Sugestão de gravação:**
```
"Tive uma discussão com minha parceira hoje. Tag-Talker identifique 
padrões emocionais e de apego Tag-Finish. Eu sempre evito conflitos, 
fico calado e depois fico ruminando sobre o que deveria ter dito. 
Percebo que faço isso desde criança com meus pais."
```

**O que observar:**
- ✅ Detecção de padrão de apego evitativo
- ✅ Identificação de supressão emocional
- ✅ Análise de ruminação como estratégia maladaptativa
- ✅ Scores OCEAN diferentes da Sessão 1 (esperado: N mais alto, A mais alto)

---

### **Sessão 3: Reflexão sobre Ansiedade/Futuro**

**Sugestão de gravação:**
```
"Estou ansioso com o futuro. Tenho tantos planos, mas nunca sei por onde 
começar. Tag-Talker analise meus níveis de conscientiousness e neuroticism 
Tag-Finish. Às vezes acordo no meio da noite pensando em tudo que preciso 
fazer. Sinto que nunca vai dar tempo."
```

**O que observar:**
- ✅ Score de Neuroticism elevado
- ✅ Conscientiousness pode estar baixo (procrastinação) ou alto (perfeccionismo)
- ✅ Identificação de catastrofização como viés cognitivo
- ✅ Detecção do tema "ansiedade" recorrente

---

## 📊 Validação dos Gráficos (após 3 sessões)

### **1. Acesse a Página de Histórico**
- Clique em "📚 Histórico" no header
- Verifique se as 3 sessões aparecem listadas

### **2. Clique em "📊 Insights"**

Você deve ver:

#### **✅ Gráfico de Radar OCEAN**
- Forma hexagonal com os 5 traços
- Valores entre 0-10 para cada dimensão
- Cores distintas para cada traço
- Tooltip ao passar o mouse

#### **✅ Gráfico de Linha - Evolução Temporal**
- Linha do tempo dos últimos 30 dias
- Múltiplas linhas coloridas (uma por traço OCEAN)
- Pontos marcando cada sessão
- Eixo Y: 0-10, Eixo X: datas

#### **✅ Gráfico de Barras - Temas Recorrentes**
- Barras coloridas para cada tema
- Altura = frequência de menções
- Labels com nomes dos temas
- Cores diferentes por barra

#### **✅ Gráfico de Barras Horizontais - Padrões Psicológicos**
- Top 5 padrões mais detectados
- Comprimento = número de ocorrências
- Labels com nomes dos padrões

#### **✅ Cards de Estatísticas**
- Total de sessões: 3
- Temas únicos identificados
- Tempo total gravado
- Média por sessão

#### **✅ Insights Automáticos**
Exemplos esperados:
- "Você menciona 'ansiedade' em 66% das suas reflexões"
- "Seu score de Neuroticism aumentou 2.3 pontos no período"
- "Padrão detectado: 'rationalization' aparece frequentemente (2x)"

---

## 🎨 Experiência Visual Esperada

### **Cores e Temas:**
- 🟣 **Púrpura/Roxo** para OCEAN e insights principais
- 🔵 **Azul** para dados informativos
- 🟢 **Verde** para tendências positivas
- 🔴 **Vermelho** para alertas/tendências negativas
- 🟡 **Amarelo/Laranja** para padrões intermediários

### **Interatividade:**
- ✅ Hover nos gráficos mostra tooltips detalhados
- ✅ Filtros de período (7/30/90/365 dias) funcionam
- ✅ Gráficos responsivos (redimensionam com a janela)
- ✅ Animações suaves ao carregar dados

---

## 🐛 Problemas Comuns e Soluções

### **Problema: Gráficos não aparecem**
**Causa:** Dados OCEAN não foram extraídos do texto
**Solução:** Certifique-se de que o Claude está retornando scores no formato:
```
O: 7/10
C: 6/10
E: 4/10
A: 8/10
N: 6/10
```

### **Problema: Linha do tempo vazia**
**Causa:** Menos de 2 sessões no período
**Solução:** Grave mais sessões ou ajuste o filtro para "7 Dias"

### **Problema: Temas não identificados**
**Causa:** Keywords não encontrados no texto
**Solução:** Use palavras como "trabalho", "ansiedade", "relacionamento" nas gravações

---

## ✅ Checklist de Validação UX

- [ ] **Gravação funciona suavemente** (sem travamentos)
- [ ] **Transcrição é precisa** (português BR correto)
- [ ] **Análise Claude é profunda** (não genérica)
- [ ] **Gráficos carregam rapidamente** (< 2 segundos)
- [ ] **Cores são agradáveis** e consistentes
- [ ] **Tooltips são informativos**
- [ ] **Insights automáticos fazem sentido**
- [ ] **Navegação é intuitiva** (voltar, buscar, filtrar)
- [ ] **Dark mode funciona** (se aplicável)
- [ ] **Você sente vontade de gravar mais** após ver os gráficos 🎯

---

## 🚀 Próximos Passos (se tudo funcionar)

1. **Export PDF** dos insights mensais
2. **Alertas inteligentes** ("Padrão de ruminação detectado 5x esta semana")
3. **Comparação de períodos** ("Este mês vs. mês passado")
4. **Tags personalizadas** (além das automáticas)
5. **Busca semântica** mais avançada
6. **Integração com calendário** (correlacionar eventos externos)

---

## 📝 Feedback Importante

Após os testes, anote:

1. **O que surpreendeu positivamente?**
2. **O que faltou ou confundiu?**
3. **Qual gráfico foi mais útil?**
4. **Qual insight gerou mais reflexão?**
5. **Você usaria isso diariamente?**

Boa sorte nos testes! 🎉
