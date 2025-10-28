# TalkerApp - AI Coding Instructions

## Project Overview
Voice-to-text PWA with AI processing. Records audio → Whisper transcription → Claude enhancement. Migrated from Electron to Next.js 16 for 98% faster builds and better UX.

## Architecture Patterns

### Core Component Structure
```typescript
// State management flows from TalkerApp.tsx down
TalkerApp.tsx         // Orchestrator - manages all state & API calls  
├── AudioRecorder.tsx // Isolated - only handles recording & waveform
└── ResultDisplay.tsx // Pure presentation - tabs, copy, display
```

### API Routes Pattern
```typescript
// app/api/[feature]/route.ts - All API keys server-side only
export async function POST(request: Request) {
  const formData = await request.formData(); // For file uploads
  const audioFile = formData.get('audio') as File;
  
  // Always use env vars, never hardcode keys
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
```

### Critical Integration Points
- **Whisper API**: `app/api/transcribe/route.ts` - FormData upload pattern
- **Claude API**: `app/api/process/route.ts` - JSON request/response  
- **Audio Recording**: MediaRecorder API with real-time waveform visualization
- **PWA**: manifest.json + service worker for installability

## Development Workflows

### Essential Commands
```powershell
# Start dev (Turbopack hot reload)
npm run dev

# Build production (1-2s vs 60s+ Electron)
npm run build && npm start

# Fix environment issues
rm -r .next && npm run dev
```

### Critical Environment Setup
⚠️ **Windows NVM Issue**: Old environment variables override `.env.local`
```powershell
# Check for conflicting vars
[System.Environment]::GetEnvironmentVariable('OPENAI_API_KEY', 'User')
# Should be null/empty

# Verify .env.local loads
npm run dev # Check console for "API Key presente:" logs
```

### Debugging Common Issues
```powershell
# Port conflicts (common on Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# API key problems
curl https://api.openai.com/v1/models -H "Authorization: Bearer $KEY"
```

## Project-Specific Conventions

### State Management Pattern
```typescript
// TalkerApp.tsx - Central state hub
const [transcription, setTranscription] = useState<string>('');
const [processedText, setProcessedText] = useState<string>('');
const [isAppendMode, setIsAppendMode] = useState<boolean>(false);

// Pass down via props, never prop drill beyond one level
<AudioRecorder onTranscriptionComplete={setTranscription} />
<ResultDisplay transcription={transcription} processedText={processedText} />
```

### File Upload Pattern
```typescript
// Always use FormData for audio uploads
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');
formData.append('append_mode', isAppendMode.toString());

const response = await fetch('/api/transcribe', {
  method: 'POST',
  body: formData // No Content-Type header - browser sets multipart
});
```

### Error Handling Standard
```typescript
// Consistent error pattern across APIs
try {
  const result = await apiCall();
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error('Operation failed:', error);
  return NextResponse.json(
    { success: false, error: 'Operation failed' },
    { status: 500 }
  );
}
```

## Stack Constraints & Decisions

### Technology Locks
- **Tailwind 3.x**: v4 has Windows binary issues, stay on stable 3.4.18
- **Next.js 16**: Latest stable, Turbopack enabled by default
- **React 19**: Concurrent features, but avoid experimental APIs
- **TypeScript strict**: All files must type-check

### Performance Requirements
- Build time: < 5s (achieved: 1-2s)
- Hot reload: < 500ms (achieved: instant)
- First load: < 3s in production
- PWA score: > 90 on Lighthouse

### Security Non-Negotiables
```typescript
// ❌ NEVER expose API keys client-side
const badKey = process.env.NEXT_PUBLIC_OPENAI_KEY;

// ✅ ALWAYS use server-side routes
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

## User Experience Focus
"Texto como Protagonista" - Text content is the primary focus, controls are secondary. Prioritize reading experience over technical complexity.

### UI Hierarchy
1. Processed text display (largest, most prominent)
2. Transcription text (secondary)  
3. Recording controls (compact, minimal)
4. Waveform (can be minimized/hidden)

## Paulo's Development Style
Creative professional (20yr cinema background) who values:
- Collaborative iteration over lone development
- Practical imagination - features must enhance real user workflows
- Question-driven development - clarify before implementing
- Modern UX patterns with intuitive interactions
- Technology as tool for human creativity, not replacement

When implementing features, always consider the human-AI interaction quality and ask clarifying questions about intended user experience.