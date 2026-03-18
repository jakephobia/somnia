/**
 * Canale Musica: FMSynth procedurale
 */

import * as Tone from 'tone';
import { musicChannel } from './channels.js';

const synth = new Tone.FMSynth({
  harmonicity: 0.5,
  modulationIndex: 1.2,
  envelope: { attack: 2, decay: 2, sustain: 1, release: 5 },
  modulationEnvelope: { attack: 2, decay: 2, sustain: 1, release: 5 },
}).connect(musicChannel);

let musicLoop = null;

export function startMusic() {
  if (musicLoop) return;

  Tone.Transport.start();

  const notes = ['C2', 'Eb2', 'F2', 'Ab2', 'Bb2', 'C3', 'Eb3'];
  const pattern = new Tone.Pattern(
    (time, note) => {
      synth.triggerAttackRelease(note, '2n', time, 0.3);
    },
    notes,
    'up'
  );
  pattern.interval = '2m';
  pattern.start(0);
  musicLoop = pattern;
}

export function stopMusic() {
  if (musicLoop) {
    musicLoop.stop();
    musicLoop.dispose();
    musicLoop = null;
  }
  synth.triggerRelease();
  Tone.Transport.stop();
}
