import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { initTracing } from '@/lib/tracing';
import { buildPrompt } from '@/lib/prompts/builder';

// Initialize tracing
initTracing();

// Validate API key at module initialization
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY não configurada');
  throw new Error('ANTHROPIC_API_KEY não configurada no ambiente');
}

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

    // Build the enhanced prompt from modular templates
    const enhancedPrompt = buildPrompt(prompt);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{ role: 'user', content: enhancedPrompt }]
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
