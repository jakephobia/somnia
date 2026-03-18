const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');

const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;
const TEMP_DIR = path.join(__dirname, '..', 'temp');
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 ora

// Regex per validare URL YouTube
const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;

// Assicura che la cartella temp esista
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve file temporanei audio
app.use('/temp', express.static(TEMP_DIR));

// Serve SoundTouch processor per AudioWorklet
app.get(
  '/soundtouch-processor.js',
  (req, res) => {
    const processorPath = path.join(
      __dirname,
      '..',
      'node_modules',
      '@soundtouchjs',
      'audio-worklet',
      'dist',
      'soundtouch-processor.js'
    );
    res.sendFile(processorPath);
  }
);

/**
 * Cleanup periodico: rimuove file più vecchi di 1 ora
 */
function cleanupTempFiles() {
  try {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    const maxAge = CLEANUP_INTERVAL_MS;

    files.forEach((file) => {
      const filePath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`[Cleanup] Rimosso: ${file}`);
      }
    });
  } catch (err) {
    console.error('[Cleanup] Errore:', err.message);
  }
}

setInterval(cleanupTempFiles, CLEANUP_INTERVAL_MS);

/**
 * Verifica se yt-dlp è disponibile
 */
async function checkYtDlp() {
  try {
    await execAsync('yt-dlp --version');
    return true;
  } catch {
    return false;
  }
}

/**
 * Estrae audio da YouTube usando yt-dlp
 * Scarica in temp/ e restituisce l'URL locale
 */
async function extractAudio(url) {
  const filename = `${uuidv4()}.m4a`;
  const outputPath = path.join(TEMP_DIR, filename);

  // -f bestaudio: migliore qualità audio
  // -x: estrai solo audio
  // --audio-format m4a: converti in m4a (compatibile con Web Audio API)
  const cmd = `yt-dlp -f bestaudio -x --audio-format m4a -o "${outputPath}" "${url}"`;

  try {
    await execAsync(cmd, { timeout: 120000 }); // 2 minuti timeout

    if (!fs.existsSync(outputPath)) {
      throw new Error('File audio non generato');
    }

    return `/temp/${filename}`;
  } catch (err) {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    throw err;
  }
}

/**
 * POST /api/extract
 * Body: { "url": "https://youtube.com/..." }
 */
app.post('/api/extract', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL mancante o non valido' });
  }

  const trimmedUrl = url.trim();
  if (!YOUTUBE_REGEX.test(trimmedUrl)) {
    return res.status(400).json({ error: 'URL YouTube non valido' });
  }

  const ytDlpAvailable = await checkYtDlp();
  if (!ytDlpAvailable) {
    return res.status(503).json({
      error: 'yt-dlp non trovato. Installalo e assicurati che sia nel PATH.',
    });
  }

  try {
    const audioUrl = await extractAudio(trimmedUrl);
    res.json({ success: true, audioUrl });
  } catch (err) {
    console.error('[Extract] Errore:', err);

    let message = 'Errore durante l\'estrazione dell\'audio';
    if (err.stderr) {
      if (err.stderr.includes('Private video') || err.stderr.includes('Video unavailable')) {
        message = 'Video non disponibile o privato';
      } else if (err.stderr.includes('Unable to extract')) {
        message = 'Impossibile estrarre l\'audio da questo video';
      } else if (err.killed || err.message?.includes('timeout')) {
        message = 'Timeout: il video potrebbe essere troppo lungo';
      }
    }

    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`SleepCast server in ascolto su http://localhost:${PORT}`);
});
