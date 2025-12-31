import { NextRequest, NextResponse } from 'next/server';
import { songStore } from '@/lib/store';

// PATCH - Aggiorna lo stato di una richiesta (played/unplayed)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { played } = body;

    let updatedRequest;
    if (played) {
      updatedRequest = songStore.markAsPlayed(id);
    } else {
      updatedRequest = songStore.markAsUnplayed(id);
    }

    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Richiesta non trovata' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      request: updatedRequest 
    });
  } catch {
    return NextResponse.json(
      { error: 'Errore nel processare la richiesta' },
      { status: 500 }
    );
  }
}

// DELETE - Elimina una richiesta
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = songStore.deleteRequest(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Richiesta non trovata' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Richiesta eliminata' 
    });
  } catch {
    return NextResponse.json(
      { error: 'Errore nel processare la richiesta' },
      { status: 500 }
    );
  }
}
