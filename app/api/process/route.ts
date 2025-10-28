import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt não fornecido' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });
    
    const result = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    return NextResponse.json({ 
      success: true, 
      result 
    });
  } catch (error) {
    console.error('Erro no processamento:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao processar com Claude API';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: 500 });
  }
}
