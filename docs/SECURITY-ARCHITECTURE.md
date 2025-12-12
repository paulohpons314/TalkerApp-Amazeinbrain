# 🔐 Arquitetura de Segurança e Privacidade - TalkerApp

> 📅 **Data:** 2025-12-04
> 👤 **Autores:** Paulo + Claude
> ✅ **Status:** Aprovado
> 🎯 **Propósito:** Definir estratégia de segurança em fases progressivas

---

## Princípios Fundamentais

### Percepção de Segurança ≠ Segurança Técnica

**Conceito-chave:**
> "Não basta o sistema ser seguro, o usuário precisa **perceber** que é seguro."

**Implicações:**
- Indicadores visuais claros de status de segurança
- Linguagem acessível (não jargão técnico)
- Transparência sobre onde os dados vão e como são protegidos
- Feedback dos testadores guiará evolução da arquitetura

---

## Contexto de Sensibilidade dos Dados

TalkerApp lida com:
- 🎙️ **Áudio:** Gravações de pensamentos livres (journal pessoal)
- 📝 **Transcrições:** Texto literal das gravações
- 🧠 **Análises Psicológicas:** BIG FIVE, Teoria do Apego, emoções implícitas, mecanismos de defesa
- 🌌 **Mapeamento Emocional:** Self-Solar System (dinâmica gravitacional de emoções)

**Conclusão:** Dados extremamente sensíveis, nível comparável a prontuários médicos.

---

## Arquitetura em 3 Fases

### 📍 Fase 1: Versão Single-User (Testador Único - Paulo)

**Contexto:** Testes internos, foco em funcionalidade e UX

#### Armazenamento

**Database (SQLite):**
- ✅ **Solução:** SQLCipher (AES-256)
- **Chave:** Derivada de senha definida pelo usuário (PBKDF2)
- **Implementação:**
  ```bash
  npm install better-sqlite3-sqlcipher
  ```
  ```typescript
  // lib/db/connection.ts
  import Database from 'better-sqlite3-sqlcipher';

  export function openDatabase(password: string) {
    const db = new Database('talkerapp.db');
    db.pragma(`key='${password}'`);
    db.pragma('cipher_page_size=4096');
    return db;
  }
  ```

**Áudio Gravado:**
- ✅ **Decisão:** Arquivar localmente (criptografado) para verificação posterior
- **Storage:** IndexedDB com wrapper de criptografia
- **Fluxo:**
  1. Gravação → Blob de áudio
  2. Encrypt blob (AES-256-GCM, mesma senha da database)
  3. Armazenar em IndexedDB com referência à sessão
  4. Manter indefinidamente (usuário pode deletar manualmente)

**Implementação de Criptografia de Áudio:**
```typescript
// lib/crypto/audioEncryption.ts
import { webcrypto } from 'crypto';

async function encryptAudioBlob(blob: Blob, password: string): Promise<ArrayBuffer> {
  const key = await deriveKey(password);
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const encrypted = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    await blob.arrayBuffer()
  );

  // Retorna: IV + Encrypted Data
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  return result.buffer;
}
```

#### Transporte

**HTTPS:**
- ✅ Localhost usa HTTP (aceitável para testes)
- ⚠️ Deploy em produção: HTTPS obrigatório

**Logs:**
- ❌ NUNCA logar: `transcription`, `analysis_text`, `audio_data`
- ✅ SEMPRE logar apenas: `sessionId`, `duration`, `wordCount`, `timestamp`, `emotionsDetected`

**Exemplo de Log Seguro:**
```typescript
logger.info({
  event: 'transcription_completed',
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
  audioDuration: 125, // segundos
  transcriptionLength: 1450, // caracteres
  wordCount: 320,
  emotionsDetected: ['joy', 'trust', 'anticipation'], // apenas IDs
  processingTime: 8.5 // segundos
  // ❌ NÃO incluir texto ou áudio
});
```

#### UX de Segurança

**Status Badge (Header):**
```
┌────────────────────────────────────┐
│ TalkerApp    🔒 Criptografado      │
└────────────────────────────────────┘
```

**Primeira Execução:**
```
┌──────────────────────────────────────┐
│  🔐 Criar Senha de Segurança         │
├──────────────────────────────────────┤
│  Seus dados serão criptografados    │
│  localmente. Defina uma senha:       │
│                                      │
│  [Senha: _______________]            │
│  [Confirmar: ___________]            │
│                                      │
│  ⚠️ IMPORTANTE:                      │
│  Se perder esta senha, não poderemos │
│  recuperar seus dados.               │
│                                      │
│  [Criar Backup da Chave]  [Prosseguir]│
└──────────────────────────────────────┘
```

**Settings > Segurança (Fase 1 - Simplificado):**
```
🔐 Segurança

┌────────────────────────────────────┐
│ Status: 🟢 Banco criptografado     │
│ Áudios: 🟢 Armazenados localmente  │
│                                    │
│ [Alterar Senha]                    │
│ [Exportar Backup]                  │
└────────────────────────────────────┘

📋 Sobre Privacidade

Seus dados são processados por:
• Whisper (OpenAI) - Transcrição
• Claude (Anthropic) - Análise

Nenhuma empresa treina modelos com
seus dados, mas eles transitam por
servidores externos.

[Saiba Mais]
```

#### Backup

**Estratégia Fase 1:**
- Export manual da chave de criptografia
- Usuário salva em local seguro (pen drive, gerenciador de senhas)
- Database pode ser copiada manualmente

**Fluxo:**
```typescript
// app/settings/security/backup.tsx
export function exportBackupKey(password: string) {
  const key = deriveKeySync(password);
  const keyHex = Buffer.from(key).toString('hex');

  downloadFile(
    'talkerapp-backup-key.txt',
    `
    TalkerApp - Chave de Backup
    Data: ${new Date().toISOString()}

    Chave: ${keyHex}

    ⚠️ GUARDE ESTE ARQUIVO COM SEGURANÇA
    Esta chave permite descriptografar seus dados.
    Não compartilhe com ninguém.
    `
  );
}
```

---

### 📍 Fase 2: Versão Multi-Tester (Testadores Conhecidos)

**Contexto:** Grupo pequeno de testadores confiáveis, feedback de UX/segurança

#### Melhorias em Relação à Fase 1

**Autenticação Local Melhorada:**
- Timeout de sessão (15 min de inatividade → lock)
- Biometria (se disponível): Touch ID, Face ID, Windows Hello
  ```typescript
  // lib/auth/biometric.ts
  if (window.PublicKeyCredential) {
    // WebAuthn disponível
    const credential = await navigator.credentials.create({
      publicKey: { /* config */ }
    });
  }
  ```

**UI de Segurança Expandida:**

**Settings > Segurança (Fase 2):**
```
🔐 Segurança & Privacidade

┌────────────────────────────────────┐
│ Autenticação                       │
│ ● Senha + Biometria                │
│ Timeout: 15 minutos                │
│ [Configurar]                       │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Armazenamento                      │
│ Database: 🟢 Criptografada (AES-256)│
│ Áudios: 🟢 Criptografados          │
│ Tamanho: 1.2 GB                    │
│ [Gerenciar Áudios]                 │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Backup Automático                  │
│ ⚠️ Nenhum backup configurado       │
│ [Configurar Backup Local]          │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Auditoria                          │
│ Última atividade: Há 2 horas       │
│ [Ver Histórico de Acesso]          │
└────────────────────────────────────┘
```

**Gerenciamento de Áudios:**
- Interface para listar áudios arquivados
- Playback com autenticação prévia
- Opção de deletar individualmente ou em lote

**Logs de Auditoria (Metadata Apenas):**
```typescript
// Tabela: security_audit_log
CREATE TABLE security_audit_log (
  id INTEGER PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'login', 'unlock', 'audio_playback', 'export'
  timestamp INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  device_fingerprint TEXT, -- Hash anônimo
  metadata TEXT -- JSON com dados não-sensíveis
);
```

---

### 📍 Fase 3: Versão Public Beta (Testadores Desconhecidos)

**Contexto:** Lançamento para usuários externos, requisitos de compliance

#### Melhorias em Relação à Fase 2

**Zero-Knowledge Architecture (Opcional):**
- Chaves de criptografia NUNCA saem do device
- Servidor só armazena database criptografada (se houver sync)
- Nem desenvolvedor consegue acessar dados

**Cloud Sync (Opcional):**
- Integração com Google Drive / Dropbox / iCloud
- Upload de database criptografada
- Chave fica apenas no device (NUNCA no cloud)

**Compliance:**
- LGPD (Brasil): Anonimização, direito ao esquecimento
- GDPR (Europa): Se expandir internacionalmente
- HIPAA (EUA): Se classificar como ferramenta médica

**Documentos Necessários:**
- Política de Privacidade
- Termos de Uso
- Consent forms (opt-in explícito)

**Exemplo de Consent:**
```
☐ Entendo que meus áudios serão processados por:
  • Whisper (OpenAI) para transcrição
  • Claude (Anthropic) para análise psicológica

☐ Confirmo que nenhum dado será usado para
  treinamento de modelos de IA

☐ Aceito que os dados transitam por servidores
  externos, mas ficam criptografados localmente

[Li e Aceito os Termos] [Cancelar]
```

**Modo Offline (Roadmap Futuro):**
- Whisper.cpp (transcrição local)
- LLM local (ex: Llama 3, Mistral)
- 100% offline, zero vazamento de dados
- Requisitos: GPU ou hardware potente

---

## 🏥 Roadmap: Versão Terapeuta-Cliente

### Arquitetura Multi-User com Roles

**Usuários:**
1. **Terapeuta** (Admin)
2. **Cliente** (User Restrito)

**Compartilhamento de Dados:**
- Cliente grava áudios → Terapeuta tem acesso às análises
- Terapeuta pode adicionar notas privadas (cliente não vê)
- Cliente pode revogar acesso a qualquer momento

### Implementação Técnica

**Database Shared:**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK(role IN ('therapist', 'client')),
  encrypted_key TEXT NOT NULL, -- Chave criptografada com senha do usuário
  created_at INTEGER NOT NULL
);

CREATE TABLE shared_sessions (
  session_id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  therapist_id TEXT NOT NULL,
  permission_level TEXT NOT NULL, -- 'read_only', 'read_write'
  granted_at INTEGER NOT NULL,
  revoked_at INTEGER,
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (therapist_id) REFERENCES users(id)
);
```

**Criptografia Multi-User:**
- Cliente criptografa seus dados com **sua chave privada**
- Terapeuta tem **chave compartilhada** derivada de ambas senhas
- Esquema de "envelope encryption":
  1. Cliente gera chave de sessão (aleatória)
  2. Dados criptografados com chave de sessão
  3. Chave de sessão criptografada com chave pública do terapeuta
  4. Terapeuta descriptografa chave de sessão com sua chave privada
  5. Terapeuta descriptografa dados com chave de sessão

**Revogação de Acesso:**
```typescript
// app/api/revoke-access/route.ts
export async function POST(req: Request) {
  const { sessionId, therapistId } = await req.json();

  // Marca acesso como revogado
  db.run(`
    UPDATE shared_sessions
    SET revoked_at = ?
    WHERE session_id = ? AND therapist_id = ?
  `, [Date.now(), sessionId, therapistId]);

  // Re-criptografa dados com nova chave (sem terapeuta)
  await reEncryptSessionData(sessionId);

  return NextResponse.json({ success: true });
}
```

**UI de Compartilhamento (Cliente):**
```
👥 Compartilhar com Terapeuta

┌────────────────────────────────────┐
│ Email do Terapeuta:                │
│ [___________________________]      │
│                                    │
│ Permissões:                        │
│ ☑ Ver transcrições                │
│ ☑ Ver análises emocionais          │
│ ☐ Adicionar notas privadas         │
│                                    │
│ [Enviar Convite]                   │
└────────────────────────────────────┘

Terapeutas com Acesso:
┌────────────────────────────────────┐
│ Dr. João Silva                     │
│ Acesso desde: 01/12/2025           │
│ Última visualização: Há 2 dias     │
│ [Revogar Acesso]                   │
└────────────────────────────────────┘
```

**UI de Visualização (Terapeuta):**
```
📋 Clientes

┌────────────────────────────────────┐
│ Maria Santos                       │
│ Última sessão: Ontem às 18:30      │
│ Sessões total: 12                  │
│ [Ver Análises] [Adicionar Nota]    │
└────────────────────────────────────┘

[Abrir sessão]
  ↓
┌────────────────────────────────────┐
│ Sessão: 03/12/2025 - 18:30        │
├────────────────────────────────────┤
│ Transcrição:                       │
│ "Hoje tive um dia difícil..."      │
│                                    │
│ Análise BIG FIVE:                  │
│ • Neuroticismo: 7/10               │
│ • Amabilidade: 8/10                │
│ ...                                │
│                                    │
│ Self-Solar System:                 │
│ [Visualização 3D]                  │
│                                    │
│ 📝 Minhas Notas (Privadas):        │
│ [___________________________]      │
│ [Salvar Nota]                      │
└────────────────────────────────────┘
```

---

## 📊 Matriz de Decisão de Segurança

| Feature | Fase 1 | Fase 2 | Fase 3 | Terapeuta-Cliente |
|---------|--------|--------|--------|-------------------|
| **Database Encryption** | ✅ SQLCipher | ✅ SQLCipher | ✅ SQLCipher | ✅ SQLCipher |
| **Audio Storage** | ✅ Local Encrypted | ✅ Local Encrypted | ✅ Local Encrypted | ✅ Local Encrypted |
| **Password Auth** | ✅ Simple | ✅ + Biometric | ✅ + 2FA | ✅ + 2FA + MFA |
| **Session Timeout** | ❌ | ✅ 15min | ✅ Configurable | ✅ Configurable |
| **Audit Logs** | ❌ | ✅ Metadata only | ✅ Full (no PII) | ✅ Full + Compliance |
| **Backup** | ✅ Manual | ✅ Auto Local | ✅ Cloud (encrypted) | ✅ Cloud (encrypted) |
| **Cloud Sync** | ❌ | ❌ | 🟡 Optional | ✅ Required |
| **Zero-Knowledge** | ❌ | ❌ | 🟡 Optional | ✅ Recommended |
| **Compliance Docs** | ❌ | ❌ | ✅ Required | ✅ Required + HIPAA |
| **Offline Mode** | ❌ | ❌ | 🟡 Roadmap | 🟡 Roadmap |

**Legenda:**
- ✅ Implementado
- 🟡 Opcional / Roadmap
- ❌ Não necessário nesta fase

---

## 🛠️ Checklist de Implementação

### Fase 1 (Atual)
- [ ] Integrar SQLCipher no projeto Next.js
- [ ] Criar tela de "Primeira Senha"
- [ ] Implementar criptografia de áudio (IndexedDB)
- [ ] Adicionar status badge "🔒 Criptografado"
- [ ] Criar página Settings > Segurança (versão básica)
- [ ] Implementar export de backup key
- [ ] Revisar todos os logs (remover dados sensíveis)
- [ ] Escrever Política de Privacidade (rascunho)

### Fase 2 (Próxima)
- [ ] Implementar biometria (WebAuthn)
- [ ] Adicionar timeout de sessão
- [ ] Criar tabela `security_audit_log`
- [ ] Interface de gerenciamento de áudios
- [ ] Playback de áudio com autenticação
- [ ] Configuração de backup automático local

### Fase 3 (Futuro)
- [ ] Cloud sync (Google Drive / Dropbox)
- [ ] Zero-knowledge encryption (opcional)
- [ ] Política de Privacidade oficial
- [ ] Termos de Uso
- [ ] Consent forms
- [ ] Modo offline (Whisper.cpp + LLM local)
- [ ] Testes de penetração

### Terapeuta-Cliente (Roadmap)
- [ ] Sistema de roles (therapist / client)
- [ ] Envelope encryption
- [ ] Interface de compartilhamento
- [ ] Revogação de acesso
- [ ] Notas privadas do terapeuta
- [ ] Compliance HIPAA (se necessário)

---

## 📚 Referências Técnicas

**Criptografia:**
- [SQLCipher Documentation](https://www.zetetic.net/sqlcipher/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

**Compliance:**
- [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [GDPR - General Data Protection Regulation](https://gdpr.eu/)
- [HIPAA - Health Insurance Portability and Accountability Act](https://www.hhs.gov/hipaa/index.html)

**Best Practices:**
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Criado em:** 2025-12-04
**Aprovado por:** Paulo
**Próxima revisão:** Após implementação Fase 1
**Status:** ✅ Documento Fundacional
