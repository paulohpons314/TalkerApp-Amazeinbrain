# 🧪 Guia de Testes - Sistema de Prompts Modular

## ✅ Implementação Concluída

### Arquitetura Instalada
```
lib/prompts/
├── templates/          # 5 templates modulares
├── variants/          
│   ├── tone/          # 3 variantes de personalidade
│   └── depth/         # 2 níveis de análise
├── experiments/       # Pasta para testes datados
├── config.ts         # Configuração TypeScript
├── builder.ts        # Motor de composição
└── README.md         # Documentação completa
```

### Correções Aplicadas
- ✅ Prompt gigante removido de `TalkerApp.tsx` (100 linhas → 3 linhas)
- ✅ TypeScript types criados (`lib/types.ts`)
- ✅ `any` removido das funções de extração
- ✅ Prompt building movido para server-side (API route)
- ✅ Build testado e funcional

---

## 🎯 Como Testar Diferentes Configurações

### Método 1: Variáveis de Ambiente (.env.local)

Edite `.env.local`:
```env
# Tom empático para testes de acolhimento
NEXT_PUBLIC_PROMPT_TONE=warm

# Análise profunda
NEXT_PUBLIC_PROMPT_DEPTH=deep

# Incluir OCEAN
NEXT_PUBLIC_PROMPT_INCLUDE_OCEAN=true
```

Reinicie o servidor:
```bash
npm run dev
```

### Método 2: Editar Templates Diretamente

**Teste rápido de linguagem:**
```bash
# Edite o template
code lib/prompts/variants/tone/balanced.md

# Salve e teste - hot reload automático!
```

**Exemplo de mudança:**
```markdown
## Tom: Equilibrado e Amigável

### Características:
- [TESTE] Use linguagem mais informal e brasileira
- [TESTE] Adicione emojis ocasionalmente
- Mantenha profissionalismo core
```

### Método 3: Criar Experimentos Datados

```bash
# Copie template atual
cp lib/prompts/templates/20-psychology-framework.md \
   lib/prompts/experiments/2025-11-11-ocean-simplified.md

# Edite a cópia
code lib/prompts/experiments/2025-11-11-ocean-simplified.md

# Documente mudanças no topo do arquivo
```

---

## 📊 Matriz de Testes Recomendada

### Fase 1: Validação de Tom (Semana 1)
| Config | Tone | Depth | OCEAN | Objetivo |
|--------|------|-------|-------|----------|
| A | warm | deep | true | Baseline empático |
| B | professional | deep | true | Baseline técnico |
| C | balanced | deep | true | **PADRÃO** |

**Métricas:**
- Tempo de leitura da análise
- Cliques em "Copiar Análise"
- Feedback subjetivo

### Fase 2: Profundidade de Análise (Semana 2)
| Config | Tone | Depth | OCEAN | Objetivo |
|--------|------|-------|-------|----------|
| D | balanced | surface | false | Usuários casuais |
| E | balanced | deep | true | Usuários sérios |

**Métricas:**
- Taxa de conclusão (lê análise até o fim)
- Retorno para novas sessões

### Fase 3: Linguagem Brasileira (Semana 3)
Edite `variants/tone/balanced.md`:
- Teste expressões coloquiais BR
- Teste referências culturais
- Teste nível de formalidade

---

## 🔧 Comandos Úteis

### Ver configuração atual
```typescript
// Em app/api/process/route.ts (temporariamente)
console.log('Config:', DEFAULT_CONFIG);
```

### Comparar duas versões de prompt
```bash
# Git diff entre versões
git diff HEAD~1 lib/prompts/templates/20-psychology-framework.md
```

### Backup antes de mudanças grandes
```bash
# Copie para experiments/
cp lib/prompts/templates/*.md lib/prompts/experiments/backup-2025-11-11/
```

---

## 🐛 Troubleshooting

### Mudanças não aparecem
```bash
# 1. Limpe cache do Next.js
rm -r .next

# 2. Reinicie dev server
npm run dev
```

### Erro de TypeScript
```bash
# Verifique types
npm run build

# Comum: esquecer de atualizar imports
```

### Prompt muito longo
```
Error: max_tokens exceeded
```
**Solução:** Reduza templates ou aumente `max_tokens` em `app/api/process/route.ts`

---

## 📈 Próximos Passos

### Imediato (Hoje)
1. ✅ Testar build: `npm run dev`
2. ✅ Fazer gravação de teste
3. ✅ Verificar output da análise

### Curto Prazo (Esta Semana)
4. ⬜ Definir baseline de tom ideal
5. ⬜ Testar 3 variantes com usuários reais
6. ⬜ Documentar descobertas em `experiments/`

### Médio Prazo (Próximas 2 Semanas)
7. ⬜ Refinar frameworks psicológicos
8. ⬜ Adicionar metrics tracking (tempo de leitura)
9. ⬜ Criar A/B testing automático

### Longo Prazo
10. ⬜ Dashboard admin para editar prompts
11. ⬜ Analytics de qual variant performa melhor
12. ⬜ Personalização por usuário

---

## 💡 Dicas de Iteração

### Mudanças Pequenas
```markdown
# ❌ Não faça isso:
Reescreva todo o prompt de uma vez

# ✅ Faça isso:
Mude 1 seção, teste, documente, commit
```

### Versionamento
```bash
# Sempre commit antes de mudanças grandes
git add lib/prompts/
git commit -m "feat: test empathetic tone variant"

# Fácil rollback se não funcionar
git revert HEAD
```

### Documentação
Em cada arquivo `.md`, adicione no topo:
```markdown
<!-- 
CHANGELOG:
2025-11-11: Aumentei validação emocional em 30%
2025-11-12: Adicionei perguntas reflexivas ao final
-->
```

---

## 🎉 Benefícios da Nova Arquitetura

| Antes | Depois |
|-------|--------|
| 100 linhas hardcoded | 5 arquivos modulares |
| Editar = rebuild | Editar = hot reload |
| 1 prompt | ∞ variações testáveis |
| Sem versionamento | Git diff claro |
| `any` types | Type-safe |
| Teste = deploy | Teste = `.env` change |

**Próxima reunião de sync:** Traga métricas de qual tom funcionou melhor! 🚀
