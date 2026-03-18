/**
 * Canale Voce: SoundTouch time-stretch + FeedbackDelay
 */

import * as Tone from 'tone';
import { SoundTouchNode } from '@soundtouchjs/audio-worklet';
import { voiceChannel } from './channels.js';
import { TEMPO, VOICE_DELAY_WET } from './config.js';

const voiceDelay = new Tone.FeedbackDelay('8n', 0.3).connect(voiceChannel);
voiceDelay.wet.value = VOICE_DELAY_WET;

export const voiceMeter = new Tone.Meter();
voiceChannel.connect(voiceMeter);

let soundTouchRegistered = false;

async function ensureSoundTouchRegistered() {
  if (soundTouchRegistered) return;
  const baseUrl = window.location.origin;
  await SoundTouchNode.register(
    Tone.getContext().rawContext,
    `${baseUrl}/soundtouch-processor.js`
  );
  soundTouchRegistered = true;
}

/**
 * Carica e avvia voce con time-stretch
 */
export async function playVoice(audioUrl) {
  await ensureSoundTouchRegistered();

  const fullUrl = audioUrl.startsWith('http')
    ? audioUrl
    : `${window.location.origin}${audioUrl}`;
  const response = await fetch(fullUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await Tone.getContext().rawContext.decodeAudioData(
    arrayBuffer
  );

  const stNode = new SoundTouchNode(Tone.getContext().rawContext);
  stNode.playbackRate.value = TEMPO;
  stNode.pitch.value = 1;
  stNode.connect(voiceDelay);

  const source = Tone.getContext().rawContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = TEMPO;
  source.connect(stNode);
  source.start(0);

  return { source, stNode };
}

export function setVoiceEcho(enabled) {
  voiceDelay.wet.value = enabled ? VOICE_DELAY_WET : 0;
}
