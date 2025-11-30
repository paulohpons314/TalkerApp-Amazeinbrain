import { NextRequest, NextResponse } from 'next/server';
import { 
  createSession, 
  getSession, 
  getAllSessions, 
  searchSessions,
  updateSessionNotes,
  deleteSession,
  getSessionCount
} from '@/lib/database';

// GET /api/history - Listar todas as sessões
// GET /api/history?search=query - Buscar sessões
// GET /api/history?id=123 - Obter sessão específica
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Buscar sessão específica por ID
    if (id) {
      const session = getSession(parseInt(id));
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Sessão não encontrada' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: session });
    }

    // Busca por texto
    if (search) {
      const results = searchSessions(search, limit);
      return NextResponse.json({ success: true, data: results });
    }

    // Listar todas as sessões
    const sessions = getAllSessions(limit, offset);
    const total = getSessionCount();
    
    return NextResponse.json({ 
      success: true, 
      data: sessions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar histórico' },
      { status: 500 }
    );
  }
}

// POST /api/history - Criar nova sessão
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      transcription, 
      processed_text, 
      analysis,
      audio_duration_seconds,
      ocean_scores,
      themes,
      psychological_elements
    } = body;

    if (!transcription || !processed_text) {
      return NextResponse.json(
        { success: false, error: 'Transcrição e texto processado são obrigatórios' },
        { status: 400 }
      );
    }

    const sessionId = createSession(
      {
        transcription,
        processed_text,
        analysis,
        audio_duration_seconds
      },
      ocean_scores,
      themes,
      psychological_elements
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: sessionId } 
    });

  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar sessão' },
      { status: 500 }
    );
  }
}

// PATCH /api/history - Atualizar notas da sessão
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, user_notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da sessão é obrigatório' },
        { status: 400 }
      );
    }

    updateSessionNotes(id, user_notes);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro ao atualizar sessão:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar sessão' },
      { status: 500 }
    );
  }
}

// DELETE /api/history?id=123 - Deletar sessão
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da sessão é obrigatório' },
        { status: 400 }
      );
    }

    deleteSession(parseInt(id));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro ao deletar sessão:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar sessão' },
      { status: 500 }
    );
  }
}
