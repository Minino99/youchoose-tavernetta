# 🎧 YouChoose - DJ Song Request App

App per permettere al pubblico di richiedere canzoni al DJ durante gli eventi.

## 🚀 Quick Start

```bash
# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev

# Oppure build e avvia in produzione
npm run build
npm start
```

L'app sarà disponibile su `http://localhost:3000`

## 📱 Come Usarla

### Per il Pubblico
Condividi l'indirizzo del tuo laptop sulla rete locale (es. `http://192.168.1.100:3000`) con il pubblico.

I visitatori possono:
- Inserire il nome della canzone
- Aggiungere l'artista (opzionale)
- Lasciare il proprio nome (opzionale)

### Per il DJ
Vai su `/dj` (es. `http://localhost:3000/dj`) per vedere:

- **Coda richieste**: Tutte le canzoni richieste in ordine di arrivo
- **Statistiche**: Quante richieste in coda, quante suonate
- **Filtri**: Vedi solo in coda, solo suonate, o tutte

Puoi:
- ✓ **Checkare** una canzone quando l'hai suonata
- ✕ **Eliminare** richieste indesiderate
- 🗑️ **Pulire** la lista (solo suonate o tutte)

## 🌐 Trovare l'IP del tuo laptop

### Windows
```bash
ipconfig
```
Cerca "Indirizzo IPv4" sotto la tua connessione WiFi.

### Mac/Linux
```bash
ifconfig | grep "inet "
# oppure
ip addr show
```

## 💡 Tips per l'Evento

1. **Connetti il laptop alla stessa rete WiFi** del locale
2. **Crea un QR code** con l'URL (es. con qr-code-generator.com)
3. **Stampa o mostra** il QR code dove tutti possono vederlo
4. **Tieni la pagina /dj aperta** sul tuo laptop durante l'evento

## 🛠️ Stack Tecnico

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **In-memory store** - Le richieste si resettano quando riavvii (perfetto per eventi)

## 📝 Note

- Le richieste sono salvate in memoria, quindi si resettano se riavvii il server
- L'app si aggiorna automaticamente ogni 3 secondi
- Design ottimizzato per mobile

