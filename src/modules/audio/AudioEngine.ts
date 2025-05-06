import { Player, Sampler, Time, now } from 'tone';
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
    private status: 'playing' | 'stopped' = 'stopped';
    private sampler: Sampler | null = null;
    private activePlayers: Set<Player> = new Set();
    private settings: IAudioSettings = {
        guitar: {
            release: 2,
            volume: 1,
        },
    };
    public recordedNotes: {
        note: string;
        time: number;
        duration: string;
        velocity: number;
    }[] = [];

    constructor(private sampleManager: SampleManager) {}

    public setVolume(value: number) {
        this.settings.guitar.volume = value;
        if (this.sampler) {
            this.sampler.volume.value = value - 8; // Установка громкости
        }
    }

    public setRelease(value: number) {
        this.settings.guitar.release = value;
    }

    async init() {
        this.status = 'stopped';
        this.cleanup(); // Очистка перед инициализацией
        const samples = await this.sampleManager.loadSamples();
        this.sampler = new Sampler({
            urls: samples,
            baseUrl: `${API_BASE_URL}/static`,
            release: this.settings.guitar.release,
            volume: this.settings.guitar.volume - 8,
            onload: () => {
                this.status = 'playing';
                console.log(`Samples loaded`);
            },
        }).toDestination();
    }

    async playSample(note: string) {
        if (!this.sampler || this.status === 'stopped') return;
        this.sampler.triggerAttackRelease(note, '8n');
        this.recordedNotes.push({
            note,
            time: Time(now()).toSeconds(),
            duration: '8n',
            velocity: 1,
        });
    }

    cleanup() {
        this.sampler?.dispose();
        this.activePlayers.forEach((p) => p.dispose());
        this.activePlayers.clear();
    }
}
