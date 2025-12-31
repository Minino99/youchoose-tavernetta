'use client';

import { useState, useEffect, useRef } from 'react';

const FRASI_SUCCESSO = [
  "nicola ghostato dalla middona",
  "tranquilli che elena raguso lo voleva",
  "saronzi",
  "Iun du e trè, quand ie bell a fè",
  "Quatt cing e sei, Ci nan part si gay",
  "Sett e iott, famm nu chinott",
  "Ordine ricevuto! Ciola in arrivo al tavolo 11",
  "Bvim... p chedda troj... d MAMT",
  "Wagliò a rutt u cazz! Sindatil a cast",
  "c'è il coprifuoco mi dispiace!",
  "Spegnete quelle luci fredde",
  "Falli un po'a più covti.... la bà",
];

interface SearchResult {
  id: number;
  songName: string;
  artistName: string;
  artwork?: string;
}

interface SelectedSong {
  songName: string;
  artistName: string;
  artwork?: string;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<SelectedSong | null>(null);
  const [yourName, setYourName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [successPhrase, setSuccessPhrase] = useState('');
  const [error, setError] = useState('');
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Cerca suggerimenti mentre l'utente digita
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    
    // Debounce: aspetta 300ms dopo che l'utente smette di digitare
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSuggestions(data.results);
        setShowSuggestions(data.results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Chiudi suggerimenti quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const selectSuggestion = (result: SearchResult) => {
    setSelectedSong({
      songName: result.songName,
      artistName: result.artistName,
      artwork: result.artwork,
    });
    setSearchQuery('');
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const clearSelection = () => {
    setSelectedSong(null);
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Usa la canzone selezionata o il testo di ricerca come fallback
    const songToSubmit = selectedSong?.songName || searchQuery.trim();
    const artistToSubmit = selectedSong?.artistName || '';

    if (!songToSubmit) {
      setError('Seleziona o inserisci una canzone!');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setShowSuggestions(false);

    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songName: songToSubmit,
          artistName: artistToSubmit,
          artwork: selectedSong?.artwork,
          requestedBy: yourName.trim(),
        }),
      });

      if (response.ok) {
        // Seleziona una frase random
        const randomPhrase = FRASI_SUCCESSO[Math.floor(Math.random() * FRASI_SUCCESSO.length)];
        setSuccessPhrase(randomPhrase);
        setShowSuccess(true);
        setSelectedSong(null);
        setSearchQuery('');
        setSuggestions([]);
        setIsExiting(false);
        // Dopo 6 secondi inizia l'animazione di uscita
        setTimeout(() => {
          setIsExiting(true);
          // Dopo l'animazione di uscita (0.5s), nascondi il messaggio
          setTimeout(() => {
            setShowSuccess(false);
            setIsExiting(false);
          }, 500);
        }, 6000);
      } else {
        const data = await response.json();
        setError(data.error || 'Errore durante l\'invio');
      }
    } catch {
      setError('Errore di connessione');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-2">
            <span className="text-6xl">🍷</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-wider text-amber-400" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>
            TAVERNETTA
          </h1>
          <h2 className="font-display text-2xl sm:text-3xl tracking-wider text-amber-200/80 -mt-1">
            DI LAPOLLA
          </h2>
          <div className="mt-4 py-2 px-4 glass rounded-full inline-block">
            <p className="text-gray-300 text-sm flex items-center gap-2">
              <span>🎵</span>
              <span>Richiedi la tua canzone al DJ</span>
              <span>🎧</span>
            </p>
          </div>
        </div>

        {/* Success Message - Più prominente con frase divertente */}
        {showSuccess && (
          <div className={`mb-6 p-6 glass rounded-2xl border-2 border-neon-green/50 bg-neon-green/15 relative overflow-hidden ${isExiting ? 'animate-bounce-out' : 'animate-bounce-in'}`}
               style={{ boxShadow: '0 0 40px rgba(34, 197, 94, 0.3), inset 0 0 30px rgba(34, 197, 94, 0.1)' }}>
            {/* Confetti effect background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-2 left-4 text-2xl animate-float" style={{ animationDelay: '0s' }}>🎉</div>
              <div className="absolute top-3 right-6 text-xl animate-float" style={{ animationDelay: '0.2s' }}>✨</div>
              <div className="absolute bottom-2 left-8 text-lg animate-float" style={{ animationDelay: '0.4s' }}>🎊</div>
              <div className="absolute bottom-3 right-4 text-xl animate-float" style={{ animationDelay: '0.3s' }}>🍻</div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl animate-pulse">🔥</span>
                <p className="font-display text-xl text-neon-green tracking-wide">RICHIESTA INVIATA!</p>
                <span className="text-3xl animate-pulse">🔥</span>
              </div>
              <div className="bg-black/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                <p className="text-lg text-amber-200 font-medium italic">"{successPhrase}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 glass rounded-2xl border-red-500/30 bg-red-500/10 animate-slide-up">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in stagger-2">
          
          {/* Selected Song Card OR Search Input */}
          {selectedSong ? (
            // Mostra la canzone selezionata
            <div className="glass rounded-2xl p-4 border border-amber-500/30 animate-slide-up" style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.15)' }}>
              <label className="block text-xs uppercase tracking-wider text-amber-400 mb-3">
                🎵 Canzone selezionata
              </label>
              <div className="flex items-center gap-4">
                {selectedSong.artwork ? (
                  <img 
                    src={selectedSong.artwork} 
                    alt="" 
                    className="w-14 h-14 rounded-xl flex-shrink-0 shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎵</span>
                  </div>
                )}
                <div className="min-w-0 flex-grow">
                  <p className="font-semibold text-lg truncate">{selectedSong.songName}</p>
                  <p className="text-gray-400 truncate">{selectedSong.artistName}</p>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex-shrink-0"
                  title="Rimuovi selezione"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            // Mostra il campo di ricerca
            <div className="relative" ref={inputRef}>
              <div className="glass rounded-2xl p-4 transition-all duration-300 focus-within:border-amber-500/50" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                  🎵 Cerca una canzone *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Titolo, artista..."
                    className="w-full bg-transparent text-white text-lg placeholder-gray-600 focus:outline-none"
                    maxLength={100}
                    autoComplete="off"
                  />
                  {isSearching && (
                    <svg className="animate-spin h-5 w-5 text-amber-400 flex-shrink-0" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden z-50 animate-slide-up">
                  {suggestions.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => selectSuggestion(result)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-b-0"
                    >
                      {result.artwork ? (
                        <img 
                          src={result.artwork} 
                          alt="" 
                          className="w-10 h-10 rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <span>🎵</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-grow">
                        <p className="font-medium truncate">{result.songName}</p>
                        <p className="text-sm text-gray-400 truncate">{result.artistName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Your Name */}
          <div className="glass rounded-2xl p-4 transition-all duration-300 focus-within:border-amber-300/50">
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
              👤 Il tuo nome
            </label>
            <input
              type="text"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="Come ti chiami? (opzionale)"
              className="w-full bg-transparent text-white text-lg placeholder-gray-600 focus:outline-none"
              maxLength={50}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (!selectedSong && !searchQuery.trim())}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-lg text-dark-900
                       bg-gradient-to-r from-amber-500 to-amber-600
                       hover:from-amber-400 hover:to-amber-500
                       transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       btn-press transform hover:scale-[1.02]"
            style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)' }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Invio in corso...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Invia Richiesta</span>
                <span>🚀</span>
              </span>
            )}
          </button>
        </form>

        {/* Hint */}
        {!selectedSong && (
          <div className="mt-4 text-center animate-fade-in">
            <p className="text-gray-600 text-xs">
              💡 Cerca e seleziona dai suggerimenti, oppure scrivi liberamente
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <span>🍷</span>
            <span>Tavernetta di Lapolla</span>
            <span>•</span>
            <span>YouChoose</span>
            <span>🎵</span>
          </div>
        </div>
      </div>
    </main>
  );
}
