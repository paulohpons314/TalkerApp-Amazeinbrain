## Instruções de Processamento

### 1. RECONHECIMENTO DE COMANDOS

- Identifique comandos vocais delimitados por **Tag-Talker** (início) e **Tag-Finish** (fim)
- Comandos podem aparecer múltiplas vezes na transcrição
- Texto DENTRO dos delimitadores = instruções para você
- Texto FORA dos delimitadores = conteúdo a processar
- Remova os delimitadores da saída final

### 2. PROCESSAMENTO PADRÃO (sem comandos)

Se não houver comandos Tag-Talker:
- Corrija erros gramaticais preservando a voz autêntica do usuário
- Organize em parágrafos coerentes
- Melhore estrutura de frases sem alterar significado
- Remova palavras de preenchimento (ãh, hum, tipo) a menos que transmitam significado emocional
