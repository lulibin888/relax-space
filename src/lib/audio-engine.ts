/**
 * Web Audio API 音频引擎
 * 用于生成解压音效和背景音乐
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/** 气泡破裂音效 */
export function playPopSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // 主音 - 短促的正弦波下滑
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);

  // 噪声层 - 模拟气泡膜的空气释放
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000 + Math.random() * 1000;
  filter.Q.value = 1;
  noise.buffer = buffer;
  noiseGain.gain.setValueAtTime(0.08, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
}

/** 柔和的叮声（用于呼吸引导转换） */
export function playChimeSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.05);
    gain.gain.linearRampToValueAtTime(0.08, now + i * 0.05 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.05);
    osc.stop(now + i * 0.05 + 1.5);
  });
}

/** 柔和按键音 */
export function playSoftClick(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

/** 解压球挤压音效 */
export function playSqueezeSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.linearRampToValueAtTime(80, now + 0.3);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

/** 白噪音类型 */
export type NoiseType = 'white' | 'pink' | 'brown' | 'rain' | 'ocean' | 'wind';

/** 白噪音生成器 */
export class NoiseGenerator {
  private sources: AudioBufferSourceNode[] = [];
  private gains: GainNode[] = [];
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private noiseType: NoiseType = 'white';

  start(type: NoiseType): void {
    if (this.isPlaying) this.stop();
    this.noiseType = type;
    const ctx = getAudioContext();
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(ctx.destination);
    // 淡入
    this.masterGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1);

    const bufferSize = ctx.sampleRate * 4; // 4 seconds loop

    switch (type) {
      case 'white':
        this.createWhiteNoise(ctx, bufferSize);
        break;
      case 'pink':
        this.createPinkNoise(ctx, bufferSize);
        break;
      case 'brown':
        this.createBrownNoise(ctx, bufferSize);
        break;
      case 'rain':
        this.createRainSound(ctx, bufferSize);
        break;
      case 'ocean':
        this.createOceanSound(ctx, bufferSize);
        break;
      case 'wind':
        this.createWindSound(ctx, bufferSize);
        break;
    }

    this.isPlaying = true;
  }

  private createWhiteNoise(ctx: AudioContext, bufferSize: number): void {
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 8000;
    source.connect(filter);
    filter.connect(this.masterGain!);
    source.start();
    this.sources.push(source);
  }

  private createPinkNoise(ctx: AudioContext, bufferSize: number): void {
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.masterGain!);
    source.start();
    this.sources.push(source);
  }

  private createBrownNoise(ctx: AudioContext, bufferSize: number): void {
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.masterGain!);
    source.start();
    this.sources.push(source);
  }

  private createRainSound(ctx: AudioContext, bufferSize: number): void {
    // 基础层：棕色噪音模拟雨声底噪
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.04 * white) / 1.04;
        lastOut = data[i];
        data[i] *= 2.5;
        // 添加随机雨滴
        if (Math.random() < 0.001) {
          const dropLen = Math.floor(Math.random() * 200 + 50);
          for (let j = 0; j < dropLen && i + j < bufferSize; j++) {
            data[i + j] += (Math.random() * 2 - 1) * 0.1 * (1 - j / dropLen);
          }
        }
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 0.5;
    source.connect(filter);
    filter.connect(this.masterGain!);
    source.start();
    this.sources.push(source);
  }

  private createOceanSound(ctx: AudioContext, bufferSize: number): void {
    // 海浪：调制的棕色噪音
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        // 海浪节奏 - 约8秒一个周期
        const wave = Math.sin(2 * Math.PI * i / (ctx.sampleRate * 8)) * 0.5 + 0.5;
        data[i] *= 3 * wave;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    source.connect(filter);
    filter.connect(this.masterGain!);
    source.start();
    this.sources.push(source);
  }

  private createWindSound(ctx: AudioContext, bufferSize: number): void {
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.01 * white) / 1.01;
        lastOut = data[i];
        // 风的起伏
        const gust = Math.sin(2 * Math.PI * i / (ctx.sampleRate * 12)) * 0.3 +
                     Math.sin(2 * Math.PI * i / (ctx.sampleRate * 5.3)) * 0.2 + 0.5;
        data[i] *= 4 * gust;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.8;
    source.connect(filter);
    filter.connect(this.masterGain!);
    source.start();
    this.sources.push(source);
  }

  setVolume(volume: number): void {
    if (this.masterGain) {
      const ctx = getAudioContext();
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, volume)),
        ctx.currentTime + 0.1
      );
    }
  }

  stop(): void {
    if (this.masterGain) {
      const ctx = getAudioContext();
      this.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    }
    setTimeout(() => {
      this.sources.forEach(s => { try { s.stop(); } catch (_e) { /* ignore */ } });
      this.sources = [];
      this.gains = [];
      this.masterGain = null;
      this.isPlaying = false;
    }, 600);
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getType(): NoiseType {
    return this.noiseType;
  }
}

/** 放松音乐生成器 - 使用五声音阶随机旋律 */
export class RelaxMusicPlayer {
  private isPlaying = false;
  private oscillators: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private padOscillators: OscillatorNode[] = [];

  // 五声音阶 (C4 pentatonic) - 听起来总是和谐的
  private pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

  start(): void {
    if (this.isPlaying) return;
    const ctx = getAudioContext();
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(ctx.destination);
    this.masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);

    // Pad 和弦层 - 持续的和声背景
    this.startPad(ctx);

    // 随机旋律层
    this.playRandomNote(ctx);
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.playRandomNote(ctx);
      }
    }, 1500 + Math.random() * 2000);

    this.isPlaying = true;
  }

  private startPad(ctx: AudioContext): void {
    // 柔和的持续和弦
    const padFreqs = [130.81, 196.00, 261.63]; // C3, G3, C4
    padFreqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.03;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      this.padOscillators.push(osc);
      this.oscillators.push(osc);
    });
  }

  private playRandomNote(ctx: AudioContext): void {
    if (!this.isPlaying || !this.masterGain) return;

    const freq = this.pentatonic[Math.floor(Math.random() * this.pentatonic.length)];
    const now = ctx.currentTime;
    const duration = 2 + Math.random() * 3;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;

    // 柔和的包络
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
    gain.gain.setValueAtTime(0.06, now + duration - 0.5);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + duration);

    // 清理
    setTimeout(() => {
      const idx = this.oscillators.indexOf(osc);
      if (idx > -1) this.oscillators.splice(idx, 1);
    }, duration * 1000 + 100);
  }

  setVolume(volume: number): void {
    if (this.masterGain) {
      const ctx = getAudioContext();
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(0.2, volume)),
        ctx.currentTime + 0.3
      );
    }
  }

  stop(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.masterGain) {
      const ctx = getAudioContext();
      this.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    }

    setTimeout(() => {
      this.oscillators.forEach(o => { try { o.stop(); } catch (_e) { /* ignore */ } });
      this.oscillators = [];
      this.padOscillators = [];
      this.masterGain = null;
    }, 1100);
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
