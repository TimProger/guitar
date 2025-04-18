import { Player, Sampler } from 'tone';
import { SampleManager } from './SampleManager';
import { API_BASE_URL } from '../../http/axios';

interface IAudioSettings {
  guitar: IGuitarSettings;
}

interface IGuitarSettings {
  release: number;
  volume: number;
}

export class AudioEngine {
  private sampler: Sampler | null = null;
  private activePlayers: Set<Player> = new Set();
  private settings: IAudioSettings = {
    guitar: {
      release: 2,
      volume: 1
    },
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
      baseUrl: `${API_BASE_URL}/static`,
      release: this.settings.guitar.release,
      volume: this.settings.guitar.volume-8,
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