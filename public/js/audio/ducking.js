/**
 * Ducking: abbassa musica quando voce attiva
 */

import { voiceMeter } from './voice.js';
import { musicChannel } from './channels.js';
import {
  DUCKING_THRESHOLD,
  DUCKING_VOLUME,
  DUCKING_RECOVERY,
} from './config.js';

let duckingAnimationId = null;
let userMusicVolume = 0;

export function setUserMusicVolume(db) {
  userMusicVolume = db;
}

export function startDucking() {
  if (duckingAnimationId) return;

  function updateDucking() {
    duckingAnimationId = requestAnimationFrame(updateDucking);
    const voiceLevel = voiceMeter.getValue();
    const level = Array.isArray(voiceLevel) ? voiceLevel[0] : voiceLevel;

    if (level > DUCKING_THRESHOLD) {
      musicChannel.volume.rampTo(DUCKING_VOLUME, 0.1);
    } else {
      musicChannel.volume.rampTo(userMusicVolume, DUCKING_RECOVERY);
    }
  }
  updateDucking();
}

export function stopDucking() {
  if (duckingAnimationId) {
    cancelAnimationFrame(duckingAnimationId);
    duckingAnimationId = null;
  }
  musicChannel.volume.cancelScheduledValues(0);
  musicChannel.volume.value = userMusicVolume;
}
