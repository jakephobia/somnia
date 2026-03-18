/**
 * Canale Suoni ambientali: Tone.Noise con filtri
 */

import * as Tone from 'tone';
import { sfxChannel } from './channels.js';

const rainFilter = new Tone.Filter({ frequency: 800, type: 'lowpass' }).connect(
  sfxChannel
);
const rainNoise = new Tone.Noise({ type: 'white' }).connect(rainFilter);

const brownNoise = new Tone.Noise({ type: 'brown' }).connect(sfxChannel);

const windFilter = new Tone.Filter({
  frequency: 400,
  type: 'bandpass',
}).connect(sfxChannel);
const windNoise = new Tone.Noise({ type: 'pink' }).connect(windFilter);

export const ambientSources = {
  rain: rainNoise,
  'brown-noise': brownNoise,
  wind: windNoise,
};

export function startAmbient(currentId) {
  Object.values(ambientSources).forEach((src) => src.stop());
  ambientSources[currentId]?.start();
}

export function stopAmbient() {
  Object.values(ambientSources).forEach((src) => src.stop());
}
