/**
 * UI: binding controlli e gestione stato pulsanti
 */

import {
  initAudio,
  playPodcast,
  stopPodcast,
  startSleepCastOnly,
  setVolume,
  setAmbientSound,
  setVoiceEcho,
} from '../audio/engine.js';
import { extractAudio } from '../api/extract.js';
import { setStatus } from './status.js';

const SLIDER_DB_MIN = -60;
const SLIDER_DB_MAX = 5;

function dbFromSlider(value) {
  return parseInt(value, 10);
}

/**
 * Inizializza tutti i controlli
 * @param {Record<string, HTMLElement>} els
 */
export function initControls(els) {
  // Slider -> volume
  const bindSlider = (sliderId, valueId, channel) => {
    const slider = els[sliderId];
    const valueEl = els[valueId];
    if (!slider || !valueEl) return;

    const update = () => {
      const v = slider.value;
      valueEl.textContent = `${v} dB`;
      setVolume(channel, dbFromSlider(v));
    };

    slider.addEventListener('input', update);
    slider.addEventListener('change', update);
    update();
  };

  bindSlider('sliderVoice', 'valueVoice', 'voice');
  bindSlider('sliderMusic', 'valueMusic', 'music');
  bindSlider('sliderSfx', 'valueSfx', 'sfx');

  // Select ambient
  els.selectAmbient?.addEventListener('change', () => {
    setAmbientSound(els.selectAmbient.value);
  });

  // Toggle echo
  els.toggleEcho?.addEventListener('change', () => {
    setVoiceEcho(els.toggleEcho.checked);
  });

  // Genera SleepCast
  els.btnGenerate?.addEventListener('click', async () => {
    const url = els.youtubeUrl?.value?.trim();
    if (!url) {
      setStatus(els.statusMessage, 'Inserisci un URL YouTube valido.', 'error');
      return;
    }

    setStatus(els.statusMessage, 'Estrazione audio in corso...', 'loading');
    els.btnGenerate.disabled = true;
    els.btnGenerate.textContent = 'Caricamento...';

    try {
      await initAudio();
      const data = await extractAudio(url);
      setStatus(els.statusMessage, 'Caricamento audio...', 'loading');
      await playPodcast(data.audioUrl);
      setStatus(els.statusMessage, 'SleepCast in riproduzione', 'success');
      els.btnStop.disabled = false;
    } catch (err) {
      setStatus(els.statusMessage, err.message || 'Errore di connessione', 'error');
    } finally {
      els.btnGenerate.disabled = false;
      els.btnGenerate.textContent = 'Genera SleepCast';
    }
  });

  // Stop
  els.btnStop?.addEventListener('click', () => {
    stopPodcast();
    setStatus(els.statusMessage, '');
    els.btnStop.disabled = true;
  });

  // Solo musica e ambient
  els.btnAmbientOnly?.addEventListener('click', async () => {
    try {
      await initAudio();
      stopPodcast();
      await startSleepCastOnly();
      setStatus(els.statusMessage, 'Musica e ambient in riproduzione', 'success');
      els.btnStop.disabled = false;
    } catch (err) {
      setStatus(els.statusMessage, err.message || 'Errore', 'error');
    }
  });
}
