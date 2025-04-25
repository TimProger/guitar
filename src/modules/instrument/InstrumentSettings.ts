import { AudioEngine } from '../audio/AudioEngine';
import { InstrumentController } from './InstrumentController';

type ITuningPreset = 'standard' | 'dropD' | 'openG' | 'custom';
export const tuningPresets = {
    standard: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
    dropD: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    openG: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
    custom: [], // Кастомный строй
};

interface IInstrumentSettings {
    getCurrentSettings(): InstrumentSettingsParams;
    setVolume(value: number): void;
    setTuning(preset: ITuningPreset, customTuning?: string[]): void;
    setRelease(value: number): void;
    subscribe(listener: () => void): () => void;
}

interface InstrumentSettingsParams {
    release: number;
    volume: number;
    tuning: {
        preset: ITuningPreset;
        notes: string[]; // Для кастомного строя
    };
    stringsCount: number;
}

class InstrumentSettings implements IInstrumentSettings {
    private listeners: Set<() => void> = new Set();
    private settings: InstrumentSettingsParams;

    constructor(
        private audioEngine: AudioEngine,
        private instrument: InstrumentController
    ) {
        this.settings = this.getDefaultSettings();
    }

    private notifyListeners() {
        this.listeners.forEach((listener) => listener());
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    public setVolume(value: number) {
        this.settings.volume = value;
        this.audioEngine.setVolume(value);
        this.notifyListeners();
    }

    public setTuning(preset: ITuningPreset, customTuning?: string[]) {
        const tunings = {
            standard: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
            dropD: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
            openG: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
        };

        let newTuning: string[] = [...this.settings.tuning.notes];

        if (preset === 'standard' || preset === 'dropD' || preset === 'openG') {
            newTuning = tunings[preset];
        } else {
            if (customTuning) {
                newTuning = customTuning;
            }
        }

        this.settings.tuning = {
            preset,
            notes: [...newTuning],
        };

        this.instrument.startChordRegistration();
        this.notifyListeners();
    }

    private getDefaultSettings(): InstrumentSettingsParams {
        return {
            release: 2,
            volume: 1,
            tuning: {
                preset: 'standard',
                notes: tuningPresets.standard,
            },
            stringsCount: 6,
        };
    }

    public setRelease(value: number) {
        this.settings.release = value;
        this.audioEngine.setRelease(value);
    }

    public getCurrentSettings(): InstrumentSettingsParams {
        return this.settings;
    }
}

export default InstrumentSettings;
