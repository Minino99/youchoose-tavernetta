import { NextRequest, NextResponse } from 'next/server';

// API iTunes per cercare canzoni
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=6&country=IT`,
      { next: { revalidate: 60 } } // Cache per 60 secondi
    );

    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await response.json();
    
    const results = data.results.map((item: {
      trackId: number;
      trackName: string;
      artistName: string;
      artworkUrl60?: string;
      artworkUrl100?: string;
    }) => ({
      id: item.trackId,
      songName: item.trackName,
      artistName: item.artistName,
      artwork: item.artworkUrl100 || item.artworkUrl60,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

