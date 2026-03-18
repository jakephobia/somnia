/**
 * Canali mixer (Voice, Music, SFX)
 */

import * as Tone from 'tone';

export const voiceChannel = new Tone.Channel().toDestination();
export const musicChannel = new Tone.Channel().toDestination();
export const sfxChannel = new Tone.Channel().toDestination();
