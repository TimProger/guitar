import { Player, Sampler } from 'tone';
import { SampleManager } from './SampleManager';

interface IAudioSettings {
  guitar: IGuitarSettings;
  effects: IAudioEffects;
}

interface IGuitarSettings {
  release: number;
  volume: number;
}

interface IAudioEffects {
  reverb?: {
    decay: number;  // Время затухания (сек)
    wet: number;    // Уровень эффекта (0-1)
  };
  distortion?: {
    amount: number; // Уровень искажения (0-1)
    wet: number;
  };
  chorus?: {
    frequency: number; // Частота модуляции (Гц)
    delayTime: number; // Задержка (мс)
    depth: number;    // Глубина (0-1)
    wet: number;
  };
  filter?: {
    type: 'lowpass' | 'highpass' | 'bandpass';
    frequency: number; // Частота среза (Гц)
    Q: number;        // Резонанс
  };
}

export class AudioEngine {
  private sampler: Sampler | null = null;
  private activePlayers: Set<Player> = new Set();
  private settings: IAudioSettings = {
    guitar: {
      release: 2,
      volume: 1
    },
    effects: {}
  };

  constructor(private sampleManager: SampleManager) {

  }

  public setVolume(value: number) {
    this.settings.guitar.volume = value;
  }

  public setRelease(value: number) {
    this.settings.guitar.release = value;
  }

  async init(instrumentType: string = 'guitar-acoustic') {
    this.cleanup(); // Очистка перед инициализацией
    const samples = await this.sampleManager.loadSamples(instrumentType);
    this.sampler = new Sampler({
      urls: samples,
      baseUrl: '/samples',
      release: this.settings.guitar.release,
      volume: this.settings.guitar.volume,
      onload: () => {
        console.log(`Samples for ${instrumentType} loaded`)
      },
    }).toDestination();
  }

  async playSample(note: string) {
    if (!this.sampler) return;
    this.sampler.triggerAttackRelease(note, '8n');
  }

  cleanup() {
    this.sampler?.dispose();
    this.activePlayers.forEach(p => p.dispose());
    this.activePlayers.clear();
  }

  setInstrument(type: string) {
    this.init(type);
  }
}