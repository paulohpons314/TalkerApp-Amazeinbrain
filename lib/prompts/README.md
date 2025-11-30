# Prompt Architecture

Sistema modular de prompts para TalkerApp. Projetado para iteração rápida durante fase de testes.

## Estrutura

```
lib/prompts/
├── templates/          # Templates base (ordem numérica)
│   ├── 00-base.md     # Identidade core
│   ├── 10-processing-rules.md
│   ├── 20-psychology-framework.md
│   ├── 30-output-format.md
│   └── 40-ethical-guidelines.md
├── variants/          # Variações testáveis
│   ├── tone/
│   │   ├── warm.md
│   │   ├── professional.md
│   │   └── balanced.md
│   └── depth/
│       ├── surface.md
│       └── deep.md
├── experiments/       # Testes datados
├── config.ts         # Configuração TypeScript
└── builder.ts        # Motor de composição
```

## Uso

### Padrão (automático)
```typescript
import { buildPrompt } from '@/lib/prompts/builder';

const prompt = buildPrompt(transcription);
```

### Customizado
```typescript
import { buildPrompt } from '@/lib/prompts/builder';

const prompt = buildPrompt(transcription, {
  tone: 'warm',
  analysisDepth: 'deep',
  includeOcean: true
});
```

### Com Builder
```typescript
import { PromptBuilder } from '@/lib/prompts/builder';

const builder = new PromptBuilder({ tone: 'professional' });
const prompt = builder.build(transcription);
```

## Configuração via .env.local

```env
# Tone: warm | professional | balanced
NEXT_PUBLIC_PROMPT_TONE=balanced

# Depth: surface | deep
NEXT_PUBLIC_PROMPT_DEPTH=deep

# Include OCEAN analysis
NEXT_PUBLIC_PROMPT_INCLUDE_OCEAN=true
```

## Testes A/B

Use presets definidos:

```typescript
import { PRESETS } from '@/lib/prompts/config';
import { buildPrompt } from '@/lib/prompts/builder';

// Teste variante empática
const promptA = buildPrompt(text, PRESETS.empathetic);

// Teste variante clínica
const promptB = buildPrompt(text, PRESETS.clinical);
```

## Versionamento

Para rastrear mudanças importantes, copie templates para `experiments/`:

```bash
cp templates/20-psychology-framework.md experiments/2025-11-11-ocean-enhanced.md
```

## Editando Prompts

1. **Templates base** (`templates/*.md`): Estrutura fundamental
2. **Variants** (`variants/tone/*.md`, `variants/depth/*.md`): Personalidade
3. **Git commit** após cada mudança significativa para rastreamento

## Hot Reload

Mudanças em arquivos `.md` são carregadas automaticamente em desenvolvimento.
Não requer rebuild do Next.js.
