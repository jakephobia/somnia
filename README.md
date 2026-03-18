# SleepCast

Applicazione web che estrae l'audio da video YouTube (podcast) e lo mixa con musica procedurale e suoni ambientali per favorire il sonno.

## Funzionalità

- **Estrazione audio da YouTube** tramite yt-dlp
- **Voce rallentata** a 0.85x con SoundTouchJS (mantiene il pitch)
- **Musica procedurale** morbida (FMSynth pentatonico)
- **Suoni ambientali** procedurali: Pioggia, Rumore marrone, Vento
- **Ducking** automatico: la musica si abbassa quando parla il podcaster
- **Mixer** con controllo volume per voce, musica e ambient
- **Modalità "Solo musica e ambient"** senza YouTube

## Prerequisiti

- **Node.js** 18+
- **yt-dlp** - [Installazione](https://github.com/yt-dlp/yt-dlp)
- **FFmpeg** - richiesto da yt-dlp per conversione audio

## Installazione

```bash
npm install
```

## Avvio

```bash
npm start
```

Apri [http://localhost:3000](http://localhost:3000)

## Utilizzo

1. Inserisci un URL YouTube (es. un podcast)
2. Clicca **Genera SleepCast** per estrarre e avviare
3. Oppure clicca **Solo musica e ambient** per ascoltare senza podcast
4. Regola i volumi con gli slider
5. Scegli il suono ambientale dal menu
6. Attiva/disattiva l'eco sulla voce
7. Clicca **Stop** per fermare

## Struttura

```
somnia/
├── backend/server.js     # Express + yt-dlp + SoundTouch processor
├── public/
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   │   ├── app.js        # UI e logica
│   │   └── audio.js     # Motore Tone.js + SoundTouchJS
│   └── dist/app.js       # Bundle (generato da npm run build)
└── temp/                 # File audio temporanei (auto-cleanup 1h)
```

## Script

- `npm start` - Build + avvia server
- `npm run dev` - Build + avvia server
- `npm run build` - Solo build frontend
