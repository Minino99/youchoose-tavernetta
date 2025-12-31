import { NextRequest, NextResponse } from 'next/server';
import { songStore } from '@/lib/store';

// POST - Cancella le richieste
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'played') {
      songStore.clearPlayed();
      return NextResponse.json({ 
        success: true, 
        message: 'Richieste suonate eliminate' 
      });
    } else if (type === 'all') {
      songStore.clearAll();
      return NextResponse.json({ 
        success: true, 
        message: 'Tutte le richieste eliminate' 
      });
    }

    return NextResponse.json(
      { error: 'Tipo non valido' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Errore nel processare la richiesta' },
      { status: 500 }
    );
  }
}

