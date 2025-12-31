// In-memory store per le richieste delle canzoni
// Usa globalThis per persistere durante hot-reload in dev mode

export interface SongRequest {
  id: string;
  songName: string;
  artistName?: string;
  artwork?: string;
  requestedBy: string;
  requestedAt: Date;
  played: boolean;
  playedAt?: Date;
}

class SongRequestStore {
  private requests: SongRequest[] = [];

  getAllRequests(): SongRequest[] {
    return [...this.requests].sort((a, b) => 
      new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
    );
  }

  getPendingRequests(): SongRequest[] {
    return this.getAllRequests().filter(r => !r.played);
  }

  getPlayedRequests(): SongRequest[] {
    return this.getAllRequests().filter(r => r.played);
  }

  addRequest(songName: string, artistName?: string, requestedBy?: string, artwork?: string): SongRequest {
    const request: SongRequest = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      songName: songName.trim(),
      artistName: artistName?.trim(),
      artwork: artwork?.trim(),
      requestedBy: requestedBy?.trim() || 'Anonimo',
      requestedAt: new Date(),
      played: false,
    };
    this.requests.push(request);
    return request;
  }

  markAsPlayed(id: string): SongRequest | null {
    const request = this.requests.find(r => r.id === id);
    if (request) {
      request.played = true;
      request.playedAt = new Date();
      return request;
    }
    return null;
  }

  markAsUnplayed(id: string): SongRequest | null {
    const request = this.requests.find(r => r.id === id);
    if (request) {
      request.played = false;
      request.playedAt = undefined;
      return request;
    }
    return null;
  }

  deleteRequest(id: string): boolean {
    const index = this.requests.findIndex(r => r.id === id);
    if (index !== -1) {
      this.requests.splice(index, 1);
      return true;
    }
    return false;
  }

  clearAll(): void {
    this.requests = [];
  }

  clearPlayed(): void {
    this.requests = this.requests.filter(r => !r.played);
  }
}

// Usa globalThis per persistere lo store durante hot-reload in dev mode
const globalForStore = globalThis as unknown as {
  songStore: SongRequestStore | undefined;
};

export const songStore = globalForStore.songStore ?? new SongRequestStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.songStore = songStore;
}
