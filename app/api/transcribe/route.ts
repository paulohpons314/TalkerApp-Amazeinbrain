import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo de áudio fornecido' },
        { status: 400 }
      );
    }

    // Converter File para formato compatível com OpenAI
    const buffer = await audioFile.arrayBuffer();
    const file = new File([buffer], 'recording.wav', { type: 'audio/wav' });
    
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'pt'
    });
    
    return NextResponse.json({ 
      success: true, 
      transcript: transcription.text 
    });
  } catch (error) {
    console.error('Erro na transcrição:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao processar áudio com Whisper';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: 500 });
  }
}
