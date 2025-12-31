'use client';

import { useState, useEffect, useCallback } from 'react';

interface SongRequest {
  id: string;
  songName: string;
  artistName?: string;
  requestedBy: string;
  requestedAt: string;
  played: boolean;
  playedAt?: string;
}

interface Stats {
  total: number;
  pending: number;
  played: number;
}

export default function DJPage() {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, played: 0 });
  const [filter, setFilter] = useState<'all' | 'pending' | 'played'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/songs?filter=${filter}`);
      const data = await response.json();
      setRequests(data.requests);
      setStats(data.stats);
    } catch (error) {
      console.error('Errore nel caricamento:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  // Auto-refresh ogni 3 secondi
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const togglePlayed = async (id: string, currentlyPlayed: boolean) => {
    try {
      await fetch(`/api/songs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ played: !currentlyPlayed }),
      });
      fetchRequests();
    } catch (error) {
      console.error('Errore:', error);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await fetch(`/api/songs/${id}`, { method: 'DELETE' });
      fetchRequests();
    } catch (error) {
      console.error('Errore:', error);
    }
  };

  const clearRequests = async (type: 'played' | 'all') => {
    try {
      await fetch('/api/songs/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      setShowClearModal(false);
      fetchRequests();
    } catch (error) {
      console.error('Errore:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 pb-24">
      {/* Header */}
      <header className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-wider glow-text-blue">
              DJ PANEL
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestisci le richieste
            </p>
          </div>
          <button
            onClick={() => setShowClearModal(true)}
            className="p-3 glass rounded-xl hover:bg-red-500/20 transition-colors"
            title="Opzioni di pulizia"
          >
            <span className="text-xl">🗑️</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in stagger-1">
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-neon-blue">{stats.pending}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">In coda</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-neon-green">{stats.played}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Suonate</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-neon-pink">{stats.total}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Totali</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 animate-fade-in stagger-2">
        {(['pending', 'played', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === f
                ? 'bg-gradient-to-r from-neon-pink to-neon-purple glow-pink'
                : 'glass hover:bg-white/10'
            }`}
          >
            {f === 'pending' && '⏳ In Coda'}
            {f === 'played' && '✅ Suonate'}
            {f === 'all' && '📋 Tutte'}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="space-y-3 animate-fade-in stagger-3">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl">🎵</div>
            <p className="text-gray-500 mt-2">Caricamento...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl">
            <div className="text-5xl mb-4">
              {filter === 'pending' && '🎧'}
              {filter === 'played' && '🎵'}
              {filter === 'all' && '📭'}
            </div>
            <p className="text-gray-400">
              {filter === 'pending' && 'Nessuna richiesta in coda'}
              {filter === 'played' && 'Nessuna canzone suonata'}
              {filter === 'all' && 'Nessuna richiesta ancora'}
            </p>
          </div>
        ) : (
          requests.map((request, index) => (
            <div
              key={request.id}
              className={`glass rounded-2xl p-4 transition-all duration-300 animate-slide-up ${
                request.played ? 'opacity-60' : 'border-l-4 border-neon-pink'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                {/* Check Button */}
                <button
                  onClick={() => togglePlayed(request.id, request.played)}
                  className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    request.played
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-white/10 hover:bg-neon-green/20 hover:text-neon-green'
                  }`}
                >
                  {request.played ? '✓' : '○'}
                </button>

                {/* Song Info */}
                <div className="flex-grow min-w-0">
                  <h3 className={`font-semibold text-lg truncate ${
                    request.played ? 'line-through text-gray-500' : ''
                  }`}>
                    {request.songName}
                  </h3>
                  {request.artistName && (
                    <p className="text-gray-400 text-sm truncate">
                      🎤 {request.artistName}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>👤 {request.requestedBy}</span>
                    <span>⏰ {formatTime(request.requestedAt)}</span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteRequest(request.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clear Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h2 className="font-display text-2xl mb-4">🗑️ PULISCI LISTA</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => clearRequests('played')}
                className="w-full py-3 px-4 glass rounded-xl hover:bg-neon-green/20 transition-colors text-left"
              >
                <span className="text-lg">✅ Elimina solo le suonate</span>
                <p className="text-xs text-gray-500 mt-1">
                  Mantieni la coda, rimuovi quelle già fatte
                </p>
              </button>
              
              <button
                onClick={() => clearRequests('all')}
                className="w-full py-3 px-4 glass rounded-xl hover:bg-red-500/20 transition-colors text-left"
              >
                <span className="text-lg">💣 Elimina tutto</span>
                <p className="text-xs text-gray-500 mt-1">
                  Ricomincia da zero
                </p>
              </button>
            </div>

            <button
              onClick={() => setShowClearModal(false)}
              className="w-full mt-4 py-3 glass rounded-xl hover:bg-white/10 transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* Floating Refresh Indicator */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <div className="glass rounded-full px-4 py-2 text-xs text-gray-500">
          🔄 Auto-refresh ogni 3s
        </div>
      </div>
    </main>
  );
}

