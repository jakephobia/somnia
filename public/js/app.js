/**
 * SleepCast - Entry point
 */

import { initControls } from './ui/controls.js';

const SELECTORS = {
  youtubeUrl: '#youtube-url',
  btnGenerate: '#btn-generate',
  btnStop: '#btn-stop',
  btnAmbientOnly: '#btn-ambient-only',
  statusMessage: '#status-message',
  sliderVoice: '#slider-voice',
  sliderMusic: '#slider-music',
  sliderSfx: '#slider-sfx',
  valueVoice: '#value-voice',
  valueMusic: '#value-music',
  valueSfx: '#value-sfx',
  selectAmbient: '#select-ambient',
  toggleEcho: '#toggle-echo',
};

function $(sel) {
  return document.querySelector(sel);
}

const elements = {
  youtubeUrl: $(SELECTORS.youtubeUrl),
  btnGenerate: $(SELECTORS.btnGenerate),
  btnStop: $(SELECTORS.btnStop),
  btnAmbientOnly: $(SELECTORS.btnAmbientOnly),
  statusMessage: $(SELECTORS.statusMessage),
  sliderVoice: $(SELECTORS.sliderVoice),
  sliderMusic: $(SELECTORS.sliderMusic),
  sliderSfx: $(SELECTORS.sliderSfx),
  valueVoice: $(SELECTORS.valueVoice),
  valueMusic: $(SELECTORS.valueMusic),
  valueSfx: $(SELECTORS.valueSfx),
  selectAmbient: $(SELECTORS.selectAmbient),
  toggleEcho: $(SELECTORS.toggleEcho),
};

initControls(elements);
