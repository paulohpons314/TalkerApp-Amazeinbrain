# UI/UX Design Directives - TalkerApp Self-Solar System

> 📅 **Data:** 2025-12-01
> 🖥️ **Plataforma:** VS Code + Claude Code CLI
> 👤 **Colaboradores:** Paulo + Claude
> 🎯 **Propósito:** Documentar decisões de design visual aprovadas para implementação Fase 3

---

## Contexto

Durante sessão de brainstorm de UI/UX (2025-12-01), Paulo definiu diretrizes visuais claras para a integração do **Self-Solar System 3D Module** ao TalkerApp. Este documento cristaliza essas decisões como referência para implementação.

---

## Arquitetura Visual: Dois Fronts Paralelos

### Front 1: Análise Tradicional
- **Ferramentas:** BIG FIVE, Teoria do Apego, Regulação Emocional
- **Apresentação:** Temporal, não-estática, com animações suaves
- **Interatividade:** Chat assistant integrado para exploração conversacional
- **Status:** Mantém funcionalidade atual, melhora apresentação

### Front 2: Self-Solar System Module (NOVO)
- **Visualização 3D:** Fibonacci sphere + gravitational emotion map
- **Detecção:** Claude identifica emoções automaticamente da transcrição
- **Física:** Simulação em tempo real (emoções orbitam o EU)
- **Interatividade:** Usuário = explorador ativo, não observador passivo

---

## 🎨 Decisões de Design Aprovadas

### 1. Estilo Visual do Cosmos 3D

**Escolha: B - Orgânico/Emocional**

**Características:**
- **Fundo:** Gradiente suave (não space-black total)
  - Sugestão: Gradient dark → darker (ex: `#1a1a2e` → `#0f0f1a`)
  - Profundidade através de layers de opacity
- **Partículas:** Com glow/blur (não esferas sólidas)
  - `box-shadow` com blur radius proporcional à intensidade emocional
  - Pulsação sutil (breathing animation)
- **Linhas de força:** Onduladas, não retas
  - Usar `CatmullRomCurve3` (Three.js) para suavidade
  - Animação de fluxo (gradient moving along line)
- **Paleta:** Cores emocionais intensas mas **dessaturadas** (ver seção 3)

**Inspiração:**
- Visualizações de dados artísticas (Refik Anadol style)
- Organic, alive, breathing
- **NÃO:** Simuladores astronômicos frios

---

### 2. Movimento e Física

**Escolha: B (sutil) - Simulação em Tempo Real com Movimento Sutil**

**Implementação:**
- **Emoções orbitam o EU** (centro gravitacional)
- **Velocidade reduzida:** 0.3x da física real (movimento perceptível mas calmo)
- **Damping alto:** Movimentos suaves, sem "saltos"
- **Breathing animation:** Partículas pulsam levemente (scale 0.95 ↔ 1.05, 2s cycle)
- **Linhas de força:** Fluxo animado (shader com `time` uniform)

**Parâmetros técnicos sugeridos:**
```javascript
const physicsConfig = {
  centerGravity: 0.05,        // Força do EU (reduzida para suavidade)
  attractionForce: 0.02,      // Forças entre emoções adjacentes
  repulsionForce: 0.03,       // Forças entre emoções opostas
  damping: 0.85,              // Alto damping = movimento suave
  maxVelocity: 0.5,           // Limita velocidade máxima
  pulseSpeed: 2000,           // Breathing: 2s por ciclo
  pulseAmplitude: 0.05        // Variação 5% do tamanho
};
```

**Comportamento:**
- Ao carregar sessão: animação de entrada (emoções "fluem" para posições)
- Durante visualização: movimento orbital sutil + pulsação
- Ao clicar em emoção: **destaque** (pause orbit, aumenta glow, mostra citações)

---

### 3. Cor e Semântica

**Escolha: B - Paleta Própria (Menos Saturada)**

**Cores Base Plutchik Dessaturadas:**

| Emoção       | Plutchik Original | TalkerApp Dessaturado | Hex Code  | Motivação                     |
|--------------|-------------------|-----------------------|-----------|-------------------------------|
| Alegria      | Amarelo           | Dourado suave         | `#d4af37` | Warm, não vibrante demais     |
| Tristeza     | Azul              | Azul slate            | `#5b7a9f` | Calmo, melancólico            |
| Raiva        | Vermelho          | Vermelho terracota    | `#b85450` | Intenso mas não agressivo     |
| Medo         | Verde             | Verde musgo           | `#6b8e6b` | Natureza, não neon            |
| Confiança    | Verde claro       | Verde sage            | `#9db39e` | Suave, confiável              |
| Nojo         | Roxo              | Roxo lavanda          | `#9d84b7` | Dessaturado, não chocante     |
| Antecipação  | Laranja           | Laranja terracota     | `#d18b5a` | Warm, expectante              |
| Surpresa     | Turquesa          | Turquesa seafoam      | `#7ab8b8` | Leve, surpreendente           |

**EU (Atrator Central):**
- Cor: Branco perolado (`#f0f0f5`)
- Glow: Azul claro (`#a8c5f0`)
- Tamanho: 1.5x maior que emoções médias
- Efeito especial: "Halo" pulsante

**Acessibilidade:**
- Todos os pares de cores testados com WCAG AAA para texto sobreposto
- Modo de alto contraste disponível (toggle)

---

### 4. Tipografia e Profundidade

**Tipografia: Inter**

**Motivação:**
- Legível em tamanhos pequenos (labels no 3D)
- Moderna, científica, mas humana
- Excelente rendering em telas de diferentes resoluções
- Open-source (compatível com projeto)

**Hierarquia Tipográfica:**
```css
/* Títulos principais */
.heading-1 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: -0.02em;
}

/* Subtítulos */
.heading-2 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  letter-spacing: -0.01em;
}

/* Labels de emoções (3D) */
.emotion-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Corpo de texto */
.body-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
}

/* Dados numéricos */
.data-value {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  font-variant-numeric: tabular-nums; /* Alinhamento de números */
}
```

**Profundidade (Z-index Strategy):**

**Aprovado: Cosmos em Background, Texto em Foreground**

```css
/* Layers de profundidade */
.z-cosmos-background {
  z-index: 1;
  opacity: 0.9; /* Sutil transparency quando texto sobrepõe */
}

.z-ui-controls {
  z-index: 10;
  background: rgba(20, 20, 30, 0.85); /* Glass morphism */
  backdrop-filter: blur(10px);
}

.z-data-panels {
  z-index: 20;
  background: rgba(30, 30, 40, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.z-modals {
  z-index: 100;
  background: rgba(15, 15, 20, 0.98);
}
```

**Interação de Profundidade:**
- Quando usuário **clica em emoção**: Cosmos ganha opacity 1.0, UI controls fade para 0.6
- Quando usuário **lê análise**: Cosmos fade para 0.5, texto em foco total
- **Hover em partícula:** Glow aumenta, z-index temporariamente > UI

---

## 🎭 Tendências de Design Aprovadas

### 1. Immersive 3D Design
**Por que: PROFUNDIDADE**

**Aplicação no TalkerApp:**
- Cosmos ocupa 70-80% da viewport (não "widget pequeno")
- Camera controls intuitivos (mouse drag = rotate, scroll = zoom)
- Parallax sutil em elementos UI quando cosmos rotaciona
- Transições de câmera suaves (não cortes bruscos)

**Técnicas:**
- Three.js `OrbitControls` com `enableDamping: true`
- FOV dinâmico (zoom = ajuste smooth de field-of-view)
- Depth of field (blur leve em emoções distantes)

---

### 2. Emotionally Intelligent Design
**Por que: FEEDBACK EMPÁTICO**

**Aplicação no TalkerApp:**
- **Status indicators clean:**
  - API online: 🟢 Badge pequeno (8px), canto superior direito
  - Processing: Spinner animado com mensagem ("Analisando suas palavras...")
  - Error: ⚠️ Toast notification (não modal agressivo)

- **Feedback contextual:**
  - Ao gravar: Frequência visual respira junto com áudio
  - Ao processar: Progress bar com etapas nomeadas ("Transcrevendo... Analisando... Construindo cosmos...")
  - Ao concluir: Animação de entrada do cosmos (celebratória, não apenas aparecer)

**Linguagem:**
- **NÃO:** "Erro 500", "Falha na requisição"
- **SIM:** "Hmm, tive dificuldade em conectar. Vamos tentar de novo?"
- **NÃO:** "Processamento concluído"
- **SIM:** "Pronto! Seu cosmos emocional está aqui ✨"

---

### 3. Light Effects and Glowing Elements
**Por que: PROFUNDIDADE E FOCO, LEVEZA**

**Aplicação no TalkerApp:**

**Glow em Emoções:**
```javascript
// Shader customizado para partículas
const glowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: emotionColor },
    intensity: { value: emotionIntensity }, // 0-10 scale
    time: { value: 0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float intensity;
    uniform float time;
    varying vec3 vNormal;

    void main() {
      float glow = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
      float pulse = 1.0 + 0.1 * sin(time * 2.0); // Breathing
      vec3 finalColor = color * (1.0 + glow * intensity * 0.3 * pulse);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
});
```

**Linhas de Força:**
- Gradient glow ao longo da linha
- Animação de "energia fluindo" (shader com offset baseado em time)
- Espessura varia com força da relação (attraction forte = linha mais grossa)

**UI Elements:**
- Botões: Hover = glow sutil (`box-shadow: 0 0 20px rgba(color, 0.4)`)
- Inputs: Focus = borda com glow suave
- Cards: Hover = elevação + glow embaixo

---

### 4. Animated Visual Elements
**Por que: ANIMAÇÕES SUAVES E SUTIS**

**Aplicação no TalkerApp:**

**Entrada/Saída de Elementos:**
```css
/* Fade + Slide Up */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-enter {
  animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Fade + Scale (para modais) */
@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-enter {
  animation: fadeScale 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Transições de Texto:**
- Mudança de conteúdo: Cross-fade (não aparecer/desaparecer bruscamente)
- Números (ex: scores): Count-up animation suave
- Labels: Stagger animation (aparecem sequencialmente com 50ms delay)

**Micro-interações:**
- Botão click: Ripple effect (Material Design style, mas dessaturado)
- Toggle switches: Slide suave com ease-out
- Tooltips: Fade in com 100ms delay (não instantâneo)

**Timing Geral:**
- Transições rápidas: 200-300ms (feedback imediato)
- Transições médias: 400-600ms (mudanças de estado)
- Transições longas: 800-1200ms (animações "hero", como cosmos loading)
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (smooth acceleration)

---

## 📐 Layout Estrutural

### Homepage (Fase 3)

```
┌─────────────────────────────────────────────────┐
│  [TalkerApp Logo]              [Status: 🟢]    │ ← Header (fixed, z-10)
├─────────────────────────────────────────────────┤
│                                                 │
│          ╔═══════════════════════╗              │
│          ║                       ║              │
│          ║   [AudioRecorder]     ║              │ ← Centralizado
│          ║   Microfone aqui      ║              │
│          ║                       ║              │
│          ╚═══════════════════════╝              │
│                                                 │
│  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈  │ ← Cosmos 3D (background)
│    ✦   ·     ·   ✦         ·    ✦    ·        │   (opacity 0.3, blur)
│  ·    ✦    ·      ✦    ·       ✦      ·   ✦   │
│     ·    ✦    ·       ·   ✦       ·      ✦    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Insights Panel (Fase 3 - Redesenhado)

```
┌─────────────────────────────────────────────────┐
│  ┌───────┬───────────────┬───────────────────┐  │
│  │ COSMOS│  TEMPORAL     │  ANÁLISE PROFUNDA │  │ ← Tabs (animated underline)
│  └───────┴───────────────┴───────────────────┘  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ╔═══════════════════════════════════════════╗  │
│  ║                                           ║  │
│  ║         [Cosmos 3D - Full Size]           ║  │ ← Aba 1: Cosmos Atual
│  ║                                           ║  │   (Three.js canvas)
│  ║   Controls: Rotate | Zoom | Reset View   ║  │
│  ║                                           ║  │
│  ║   Sidebar (direita):                      ║  │
│  ║   • Alegria: ████████░░ 8/10              ║  │
│  ║   • Tristeza: ███░░░░░░░ 3/10             ║  │
│  ║   [Clique em emoção para ver citações]   ║  │
│  ╚═══════════════════════════════════════════╝  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Especificações Técnicas

### Stack de Visualização 3D

**Core:**
- **Three.js** r160+ (atualização da versão do cosmos-expanded.html)
- **React Three Fiber** (wrapper React para Three.js)
- **@react-three/drei** (helpers para controls, effects)
- **@react-three/postprocessing** (bloom, depth-of-field)

**Física:**
- Implementar solver de EDOs em JavaScript (port do modelo matemático)
- Usar `requestAnimationFrame` para loop de física (60fps)
- Web Workers para cálculos pesados (não bloquear UI thread)

**Performance:**
- Instanced meshes para partículas (como cosmos-expanded.html)
- Level-of-detail (LOD): reduzir geometria em zoom out
- Frustum culling: não renderizar emoções fora da câmera

### Integração com Claude

**Fluxo de Dados:**
```
Transcrição (string)
  ↓
Claude Processing (API)
  ↓
JSON estruturado:
{
  "emotions": {
    "alegria": { "intensity": 8, "citations": ["...", "..."] },
    "tristeza": { "intensity": 3, "citations": ["..."] },
    ...
  },
  "ocean_scores": { "O": 7, "C": 6, ... },
  "relationships": [
    { "from": "alegria", "to": "confianca", "strength": 0.8, "type": "attraction" },
    ...
  ]
}
  ↓
Three.js Scene Construction
  ↓
Physics Simulation Start
```

**Novo Endpoint de API:**
```typescript
// app/api/process-emotions/route.ts
export async function POST(req: Request) {
  const { transcription } = await req.json();

  // Claude processa com prompt especial
  const emotionsData = await analyzeEmotions(transcription);

  // Retorna estrutura para Three.js
  return NextResponse.json({
    emotions: emotionsData.emotions,
    relationships: emotionsData.relationships,
    eu_baseline: emotionsData.baseline // Estado EU do indivíduo
  });
}
```

---

## 📋 Checklist de Implementação

### Fase 3.1: Protótipo Cosmos 3D (Próxima Sessão)
- [ ] Adaptar `cosmos-expanded.html` para React component
- [ ] Implementar paleta dessaturada (cores definidas acima)
- [ ] Adicionar glow shaders
- [ ] Integrar OrbitControls com damping
- [ ] Testar performance com 8 partículas

### Fase 3.2: Física Emocional
- [ ] Portar modelo matemático Self-Solar System para JavaScript
- [ ] Implementar forças gravitacionais (EU, attraction, repulsion)
- [ ] Adicionar damping e velocity limits
- [ ] Criar animação de breathing (pulsação)
- [ ] Web Worker para cálculos de física

### Fase 3.3: Integração Claude
- [ ] Criar prompt especial para detecção de emoções
- [ ] Novo endpoint `/api/process-emotions`
- [ ] Parser de resposta Claude → JSON estruturado
- [ ] Validação de dados (fallback se Claude não detectar emoção)

### Fase 3.4: UI Components
- [ ] Redesenhar Insights Panel (3 abas)
- [ ] Sidebar com intensidades + citações
- [ ] Chat assistant integrado (Aba Temporal)
- [ ] Tooltips informativos (explicar cada emoção)

### Fase 3.5: Animações e Polimento
- [ ] Animações de entrada/saída (CSS + Framer Motion)
- [ ] Micro-interações (hover, click, toggle)
- [ ] Loading states (skeleton screens)
- [ ] Transições de câmera (zoom para emoção clicada)

### Fase 3.6: Acessibilidade
- [ ] Modo alto contraste
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader labels (ARIA)
- [ ] Modo reduzir animações (prefers-reduced-motion)

---

## 🎯 Critérios de Sucesso

**Funcional:**
- ✅ Cosmos renderiza 8 emoções em posições corretas
- ✅ Física simula atração/repulsão em tempo real
- ✅ Claude detecta emoções automaticamente
- ✅ Clique em emoção mostra citações literais

**Estético:**
- ✅ Animações suaves, sem "saltos"
- ✅ Glow e light effects funcionam em todos navegadores
- ✅ Tipografia Inter legível em todos tamanhos
- ✅ Paleta dessaturada mantém emoções distinguíveis

**Performance:**
- ✅ 60fps constante em laptops médios (GTX 1650 / Intel Iris)
- ✅ Load time < 2s para construir cosmos
- ✅ Física não bloqueia UI (Web Worker funcional)

**UX:**
- ✅ Usuário entende imediatamente que pode interagir (affordances claros)
- ✅ Status indicators previnem perda de dados (UX safeguards)
- ✅ Feedback empático em erros (linguagem humana)

---

## 📝 Notas de Desenvolvimento

### Prioridades de Implementação

**Alta Prioridade (Fase 3):**
1. Cosmos 3D funcional (sem física complexa ainda)
2. Integração básica com Claude (detectar emoções)
3. Paleta de cores e glow effects

**Média Prioridade (Fase 4):**
1. Física completa (modelo matemático Self-Solar)
2. Animações avançadas (breathing, fluxo)
3. Chat assistant

**Baixa Prioridade (Fase 5):**
1. Modo alto contraste
2. Customização de paleta pelo usuário
3. Export de visualização 3D (screenshot, vídeo)

### Possíveis Desafios Técnicos

**1. Performance de Física em Tempo Real:**
- **Solução:** Web Worker + simplificação do modelo (aproximações numéricas)
- **Fallback:** Modo "snapshot" (sem movimento) se device for lento

**2. Compatibilidade WebGL:**
- **Solução:** Detecção de capacidades + fallback para visualização 2D
- **Target:** WebGL 2.0 (suportado em 95%+ dos navegadores modernos)

**3. Consistência de Detecção de Emoções:**
- **Solução:** Prompt altamente estruturado + validação de JSON
- **Fallback:** Se Claude não retornar emoções, usar análise OCEAN como proxy

---

## 🔗 Referências

**Design:**
- [Awwwards - Immersive 3D Experiences](https://www.awwwards.com/websites/three-js/)
- [Codrops - Glow Effects](https://tympanus.net/codrops/)
- [Refik Anadol - Data Sculptures](https://refikanadol.com/)

**Técnicas:**
- [Three.js Journey](https://threejs-journey.com/)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [Self-Solar System Model](./Self-Solar-System-Project.md)

**Pesquisa:**
- [Building Your Reality - Emotions Research](./Building Your Reality - Emotions, Feelings and Thoughts.md)
- [Lisa Feldman Barrett - How Emotions Are Made](https://www.lisafeldmanbarrett.com/)

---

**Criado em:** 2025-12-01
**Última atualização:** 2025-12-01
**Próxima revisão:** Após protótipo Cosmos 3D
**Status:** ✅ Aprovado para implementação
