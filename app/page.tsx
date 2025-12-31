'use client';

import { useState } from 'react';

export default function HomePage() {
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [yourName, setYourName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!songName.trim()) {
      setError('Inserisci il nome della canzone!');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songName: songName.trim(),
          artistName: artistName.trim(),
          requestedBy: yourName.trim(),
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setSongName('');
        setArtistName('');
        // Keep the name for next requests
        setTimeout(() => setShowSuccess(false), 3000);
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-6xl">🎧</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl tracking-wider glow-text-pink">
            YOUCHOOSE
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Richiedi la tua canzone al DJ
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 glass rounded-2xl border-neon-green/30 bg-neon-green/10 animate-slide-up">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-semibold text-neon-green">Richiesta inviata!</p>
                <p className="text-sm text-gray-400">Il DJ la vedrà presto</p>
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
          {/* Song Name */}
          <div className="glass rounded-2xl p-4 transition-all duration-300 focus-within:border-neon-pink/50 focus-within:glow-pink">
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
              🎵 Canzone *
            </label>
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              placeholder="Nome della canzone..."
              className="w-full bg-transparent text-white text-lg placeholder-gray-600 focus:outline-none"
              maxLength={100}
            />
          </div>

          {/* Artist Name */}
          <div className="glass rounded-2xl p-4 transition-all duration-300 focus-within:border-neon-blue/50 focus-within:glow-blue">
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
              🎤 Artista
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Nome dell'artista (opzionale)"
              className="w-full bg-transparent text-white text-lg placeholder-gray-600 focus:outline-none"
              maxLength={100}
            />
          </div>

          {/* Your Name */}
          <div className="glass rounded-2xl p-4 transition-all duration-300 focus-within:border-neon-purple/50">
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
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-lg
                       bg-gradient-to-r from-neon-pink to-neon-purple
                       hover:from-neon-pink hover:to-neon-pink
                       glow-pink transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       btn-press transform hover:scale-[1.02]"
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

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Powered by 🎧 YouChoose
          </p>
        </div>
      </div>
    </main>
  );
}

