// Web Audio API Divine Audio Soundscape Synthesizer

class AudioSynthEngine {
  constructor() {
    this.ctx = null;
    this.activeNodes = [];
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stop() {
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // node already stopped
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  // Plays a divine ambient soundscape based on track key/type
  playDivineSoundscape(type = 'om_528', duration = 300) {
    this.init();
    this.stop();
    this.isPlaying = true;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);
    this.activeNodes.push(masterGain);

    const now = this.ctx.currentTime;

    if (type.includes('om') || type.includes('528')) {
      // 528Hz Solfeggio Miracle Frequency + 136.1Hz Om fundamental
      const freqs = [136.1, 272.2, 528, 639];
      freqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Gentle LFO modulation for breathing aura
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + i * 0.05, now);
        lfoGain.gain.setValueAtTime(0.04, now);
        lfo.connect(lfoGain.gain);

        gain.gain.setValueAtTime(0.05 / (i + 1), now);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        lfo.start(now);

        this.activeNodes.push(osc, gain, lfo, lfoGain);
      });
    } else if (type.includes('flute') || type.includes('bowl')) {
      // Tibetan Bowl Harmonics (432Hz base)
      const freqs = [432, 864, 1296];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Bell envelope
        gain.gain.setValueAtTime(0.15 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 12);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        this.activeNodes.push(osc, gain);
      });
    } else {
      // Sacred Ambient Drone
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(216, now); // 432Hz / 2
      osc.connect(masterGain);
      osc.start(now);
      this.activeNodes.push(osc);
    }
  }

  // Generates a Blob audio file for offline download simulation
  async generateOfflineAudioBlob(trackTitle, durationSec = 10) {
    const sampleRate = 44100;
    const numChannels = 2;
    const numFrames = sampleRate * durationSec;
    const offlineCtx = new OfflineAudioContext(numChannels, numFrames, sampleRate);

    // Build divine harmonics in offline context
    const masterGain = offlineCtx.createGain();
    masterGain.gain.setValueAtTime(0.3, 0);
    masterGain.connect(offlineCtx.destination);

    const freqs = [136.1, 272.2, 432, 528];
    freqs.forEach((f, idx) => {
      const osc = offlineCtx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, 0);

      const gain = offlineCtx.createGain();
      gain.gain.setValueAtTime(0.1 / (idx + 1), 0);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(0);
    });

    const renderedBuffer = await offlineCtx.startRendering();
    
    // Convert AudioBuffer to WAV Blob
    return audioBufferToWavBlob(renderedBuffer);
  }
}

// Convert AudioBuffer to WAV Blob helper
function audioBufferToWavBlob(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  let channels = [], sampleRate = buffer.sampleRate, offset = 0, pos = 0;

  function writeString(str) {
    for (let i = 0; i < str.length; i++) {
      out.setUint8(pos++, str.charCodeAt(i));
    }
  }

  function setUint16(data) {
    out.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  writeString('RIFF');
  setUint32(length - 8);
  writeString('WAVE');
  writeString('fmt ');
  setUint32(16);
  setUint16(1);
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);
  writeString('data');
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out], { type: 'audio/wav' });
}

export const audioSynth = new AudioSynthEngine();
