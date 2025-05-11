import { Player, Sampler, Time, now } from 'tone';
import { SampleManager } from './SampleManager';
import { API_BASE_URL } from '../../http/axios';
import { INote } from '@/types/guitar.types';

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
    private audioContext: AudioContext;
    private samples: Map<string, AudioBuffer> = new Map();
    private isRecording: boolean = false;
    private recordedNotes: INote[] = [];
    private recordingStartTime: number = 0;

    constructor(private sampleManager: SampleManager) {
        this.audioContext = new AudioContext();
        this.loadSamples();
    }

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
        if (this.isRecording) {
            this.recordedNotes.push({
                note,
                time: Time(now()).toSeconds() - this.recordingStartTime,
                duration: '8n',
                velocity: 1,
            });
        }
    }

    cleanup() {
        this.sampler?.dispose();
        this.activePlayers.forEach((p) => p.dispose());
        this.activePlayers.clear();
    }

    private async loadSamples() {
        // Загрузка сэмплов
        const sampleNames = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
        for (const name of sampleNames) {
            try {
                const response = await fetch(`/samples/${name}.mp3`);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.samples.set(name, audioBuffer);
            } catch (error) {
                console.error(`Failed to load sample ${name}:`, error);
            }
        }
    }

    public startRecording() {
        this.isRecording = true;
        this.recordedNotes = [];
        this.recordingStartTime = Time(now()).toSeconds();
    }

    public stopRecording(): INote[] {
        this.isRecording = false;
        const notes = [...this.recordedNotes];

        return notes;
    }

    public playRecordedNotes(callback: () => void): void {
        const notes = [...this.recordedNotes];

        if (!notes.length) {
            callback();
            return;
        }

        // Воспроизводим записанные ноты
        notes.forEach((note) => {
            const time = note.time || 0;

            // Запускаем ноту через setTimeout для соблюдения временных интервалов
            setTimeout(() => {
                this.playSample(note.note);
            }, time * 1000); // Конвертируем секунды в миллисекунды
        });

        setTimeout(
            () => {
                callback();
            },
            (notes[notes.length - 1].time || 0) * 1000
        );
    }

    public getRecordedNotes(): INote[] {
        return [...this.recordedNotes];
    }
}
