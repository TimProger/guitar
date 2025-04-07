import { Player, Sampler } from 'tone';
import { SampleManager } from './SampleManager';

class AudioEngine {
  private sampler: Sampler | null = null;
  private activePlayers: Set<Player> = new Set();

  constructor(private sampleManager: SampleManager) {}

  async init(instrumentType: string = 'guitar-acoustic') {
    this.cleanup(); // Очистка перед инициализацией
    const samples = await this.sampleManager.loadSamples(instrumentType);
    console.log(samples)
    this.sampler = new Sampler({
      urls: samples,
      baseUrl: '/samples',
      release: 2,
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

export const audioEngine = new AudioEngine(new SampleManager());