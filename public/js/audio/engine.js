/**
 * Motore audio: orchestrazione e API pubblica
 */

import * as Tone from 'tone';
import { voiceChannel, musicChannel, sfxChannel } from './channels.js';
import { playVoice, setVoiceEcho as setVoiceEchoImpl } from './voice.js';
import { startMusic, stopMusic } from './music.js';
import {
  ambientSources,
  startAmbient,
  stopAmbient,
} from './ambient.js';
import {
  startDucking,
  stopDucking,
  setUserMusicVolume,
} from './ducking.js';

let initialized = false;
let voiceSource = null;
let voiceStNode = null;
let currentAmbient = 'rain';
let isPlaying = false;

export async function initAudio() {
  if (initialized) return;
  await Tone.start();
  initialized = true;
}

export function setVolume(channel, db) {
  const ch = {
    voice: voiceChannel,
    music: musicChannel,
    sfx: sfxChannel,
  }[channel];
  if (ch) {
    ch.volume.value = db;
    if (channel === 'music') setUserMusicVolume(db);
  }
}

export function setVoiceEcho(enabled) {
  setVoiceEchoImpl(enabled);
}

export function setAmbientSound(id) {
  currentAmbient = id;
  if (ambientSources[id] && isPlaying) {
    Object.values(ambientSources).forEach((src) => src.stop());
    ambientSources[id].start();
  }
}

export async function playPodcast(audioUrl) {
  await initAudio();
  stopPodcast();

  const { source, stNode } = await playVoice(audioUrl);
  voiceSource = source;
  voiceStNode = stNode;
  isPlaying = true;

  startDucking();
  startMusic();
  startAmbient(currentAmbient);
}

export function stopPodcast() {
  isPlaying = false;
  if (voiceSource) {
    try {
      voiceSource.stop();
    } catch (_) {}
    voiceSource = null;
  }
  if (voiceStNode) {
    voiceStNode.disconnect();
    voiceStNode = null;
  }
  stopDucking();
  stopMusic();
  stopAmbient();
}

export async function startSleepCastOnly() {
  await initAudio();
  isPlaying = true;
  startMusic();
  startAmbient(currentAmbient);
}
