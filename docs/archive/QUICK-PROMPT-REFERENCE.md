# 🎯 Quick Reference - Prompt Testing

## 🚀 Start Testing Now

```bash
npm run dev
```

## ⚡ Change Personality (30 seconds)

Edit `.env.local`:
```env
NEXT_PUBLIC_PROMPT_TONE=warm        # Empático
# ou
NEXT_PUBLIC_PROMPT_TONE=professional # Técnico
# ou  
NEXT_PUBLIC_PROMPT_TONE=balanced    # Equilibrado (padrão)
```

Restart: `Ctrl+C` → `npm run dev`

## 📝 Edit Prompt Content (instant hot reload)

```bash
# Edite qualquer template
code lib/prompts/templates/20-psychology-framework.md

# Ou variante de tom
code lib/prompts/variants/tone/balanced.md

# Salve = mudança aplicada! (sem rebuild)
```

## 🧪 Common Test Scenarios

### 1. Teste Tom Empático
```env
NEXT_PUBLIC_PROMPT_TONE=warm
NEXT_PUBLIC_PROMPT_DEPTH=deep
NEXT_PUBLIC_PROMPT_INCLUDE_OCEAN=true
```

### 2. Teste Análise Rápida
```env
NEXT_PUBLIC_PROMPT_TONE=balanced
NEXT_PUBLIC_PROMPT_DEPTH=surface
NEXT_PUBLIC_PROMPT_INCLUDE_OCEAN=false
```

### 3. Teste Modo Clínico
```env
NEXT_PUBLIC_PROMPT_TONE=professional
NEXT_PUBLIC_PROMPT_DEPTH=deep
NEXT_PUBLIC_PROMPT_INCLUDE_OCEAN=true
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/prompts/variants/tone/balanced.md` | Tom padrão |
| `lib/prompts/templates/20-psychology-framework.md` | Análise OCEAN |
| `lib/prompts/templates/40-ethical-guidelines.md` | Diretrizes éticas |
| `.env.local` | Configuração ativa |

## 🐛 Troubleshooting

```bash
# Mudanças não aparecem?
rm -r .next && npm run dev

# Ver erros TypeScript?
npm run build
```

## 📚 Full Guides

- `IMPLEMENTATION-SUMMARY.md` - O que foi implementado
- `TESTING-PROMPTS-GUIDE.md` - Guia completo de testes
- `lib/prompts/README.md` - Documentação técnica

---

**Próximo passo:** Faça uma gravação de teste e compare os 3 tons! 🎤
