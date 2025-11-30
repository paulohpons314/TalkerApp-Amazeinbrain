import { NextRequest, NextResponse } from 'next/server';
import { generateInsights, getGeneralStats, getOceanEvolution } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const type = searchParams.get('type') || 'summary';

    if (type === 'summary') {
      const insights = generateInsights(days);
      return NextResponse.json({ success: true, data: insights });
    }

    if (type === 'stats') {
      const stats = getGeneralStats();
      return NextResponse.json({ success: true, data: stats });
    }

    if (type === 'evolution') {
      const evolution = getOceanEvolution(days);
      return NextResponse.json({ success: true, data: evolution });
    }

    return NextResponse.json(
      { success: false, error: 'Tipo de análise inválido' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erro ao gerar insights:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar insights' },
      { status: 500 }
    );
  }
}
