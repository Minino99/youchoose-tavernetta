import { NextRequest, NextResponse } from 'next/server';
import { songStore } from '@/lib/store';

// GET - Ottieni tutte le richieste
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');

  let requests;
  switch (filter) {
    case 'pending':
      requests = songStore.getPendingRequests();
      break;
    case 'played':
      requests = songStore.getPlayedRequests();
      break;
    default:
      requests = songStore.getAllRequests();
  }

  return NextResponse.json({ 
    requests,
    stats: {
      total: songStore.getAllRequests().length,
      pending: songStore.getPendingRequests().length,
      played: songStore.getPlayedRequests().length,
    }
  });
}

// POST - Aggiungi una nuova richiesta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songName, artistName, requestedBy, artwork } = body;

    if (!songName || songName.trim() === '') {
      return NextResponse.json(
        { error: 'Il nome della canzone è obbligatorio' },
        { status: 400 }
      );
    }

    const newRequest = songStore.addRequest(songName, artistName, requestedBy, artwork);
    
    return NextResponse.json({ 
      success: true, 
      request: newRequest,
      message: 'Richiesta inviata! 🎵'
    });
  } catch {
    return NextResponse.json(
      { error: 'Errore nel processare la richiesta' },
      { status: 500 }
    );
  }
}

