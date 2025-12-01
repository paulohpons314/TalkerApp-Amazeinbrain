# 📝 Guidelines de Documentação - TalkerApp

> **Propósito:** Evitar sobreposição divergente de alterações e facilitar rastreamento de mudanças ao longo do tempo.

---

## 🎯 Princípio Fundamental

**Toda documentação de desenvolvimento deve conter:**
1. **DATA** da sessão (formato: YYYY-MM-DD)
2. **PLATAFORMA** utilizada (VS Code, CLI, Browser, etc.)
3. **CONTEXTO** da mudança (por quê foi feito)

---

## 📋 Template para Novos Documentos

Use este template ao criar qualquer novo arquivo de documentação relacionado a sessões de desenvolvimento:

```markdown
# [TÍTULO DO DOCUMENTO]

> 📅 **Data:** YYYY-MM-DD
> 🖥️ **Plataforma:** VS Code / CLI / Claude Desktop / Outro
> 👤 **Colaboradores:** [Humano + IA, se aplicável]
> 🏷️ **Versão:** [número se aplicável]

---

## Contexto

[Por que este documento foi criado? Qual problema estava sendo resolvido?]

---

## Mudanças Realizadas

[Lista detalhada de alterações]

---

## Decisões Tomadas

[Escolhas importantes feitas durante a sessão e suas justificativas]

---

## Próximos Passos

[O que ficou pendente ou deve ser feito em seguida]

---

## Notas Técnicas

[Detalhes de implementação relevantes para futuras referências]
```

---

## 📂 Organização de Arquivos

### Documentação Ativa (Raiz do Projeto)
Apenas documentos **essenciais e atualizados**:
- `README.md` - Visão geral e setup
- `DESIGN_PRINCIPLES.md` - Filosofia de design e UX
- `DOCUMENTATION-GUIDELINES.md` - Este arquivo

### Documentação Arquivada (`docs/archive/`)
Documentos de **sessões antigas** ou **obsoletos**:
- Nomes sugeridos: `SESSION-[DATA]-[TÓPICO].md`
- Exemplo: `SESSION-2025-11-29-UI-Brainstorm.md`
- Sempre incluir data no nome do arquivo

### Experimentos (`docs/experiments/`)
Código de teste, protótipos, componentes experimentais

---

## ✅ Checklist para Documentar Mudanças

Antes de finalizar qualquer sessão de desenvolvimento, pergunte-se:

- [ ] As mudanças foram documentadas com DATA?
- [ ] A PLATAFORMA (VS Code/CLI) foi registrada?
- [ ] O CONTEXTO (por quê) foi explicado?
- [ ] Decisões importantes foram justificadas?
- [ ] Pendências foram listadas em "Próximos Passos"?
- [ ] Se gerou novo documento, ele segue o template?

---

## 🚫 Anti-Padrões (O Que Evitar)

❌ **Não fazer:**
- Criar múltiplos READMEs sem organização clara
- Documentar sem data ou contexto
- Deixar comentários vagos tipo "melhorias gerais"
- Acumular arquivos `.bak`, `.old`, `~` no repositório

✅ **Fazer:**
- 1 README principal na raiz
- Data + Plataforma em todo documento
- Explicar "por quê" além de "o quê"
- Arquivar documentação antiga em `docs/archive/`

---

## 📌 Exemplo de Bom Documento

```markdown
# Refatoração do Sistema de Prompts

> 📅 **Data:** 2025-11-11
> 🖥️ **Plataforma:** VS Code + Claude Code
> 👤 **Colaboradores:** Paulo + Claude

## Contexto

O sistema de prompts estava monolítico em um único arquivo de 500+ linhas,
dificultando testes e iteração rápida.

## Mudanças Realizadas

1. Criado `lib/prompts/builder.ts` - Sistema modular
2. Templates separados em `lib/prompts/templates/`
3. Variantes de tom/profundidade em `lib/prompts/variants/`

## Decisões Tomadas

- **Por que modular?** Facilita A/B testing de variantes de prompt
- **Por que markdown?** Legibilidade e editabilidade fora do código
- **Por que não usar banco?** Fase inicial, prematura otimização

## Próximos Passos

- [ ] Criar variante "clínica" para uso profissional
- [ ] Implementar cache de prompts compilados
- [ ] Adicionar telemetria para avaliar eficácia

## Notas Técnicas

- PromptBuilder usa fs.readFileSync (síncrono OK pois server-side)
- Templates carregados uma vez na inicialização
- Separadores `---` entre seções (CommonMark)
```

---

## 🔄 Processo Recomendado

### Ao Iniciar Sessão de Desenvolvimento
1. Verificar data/plataforma da última sessão
2. Revisar "Próximos Passos" do último documento
3. Documentar divergências encontradas

### Durante a Sessão
1. Anotar decisões importantes em tempo real
2. Explicar "por quê" de escolhas arquiteturais
3. Listar bloqueios encontrados

### Ao Finalizar Sessão
1. Consolidar mudanças em documento
2. Atualizar README se necessário
3. Marcar tarefas concluídas
4. Listar pendências claras

---

## 🎓 Filosofia de Documentação

> **"Documentação é comunicação com seu eu futuro."**

Boa documentação:
- **Contextualiza** decisões
- **Justifica** escolhas
- **Registra** falhas e aprendizados
- **Orienta** próximas sessões

Documentação ruim:
- Lista ações sem explicar por quê
- Não tem data/autor
- Usa jargão sem definir
- Não conecta mudanças ao objetivo

---

## 📞 Dúvidas?

Se estiver incerto sobre como documentar algo específico:
1. Pergunte ao colaborador IA durante a sessão
2. Priorize **clareza** sobre formalidade
3. Documente a dúvida também (meta-documentação)

---

**Criado em:** 2025-12-01
**Plataforma:** VS Code + Claude Code CLI
**Versão:** 1.0
