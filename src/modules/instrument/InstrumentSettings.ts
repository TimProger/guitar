import { AudioEngine } from "../audio/AudioEngine";
import { Instrument } from "./Instrument";

type ITuningPreset = 'standard' | 'dropD' | 'openG' | 'custom';

interface InstrumentSettingsParams {
    release: number;
    volume: number;
    tuning: {
        preset: ITuningPreset;
        customTuning?: string[]; // Для кастомного строя
    };
    stringsCount: number;
}

class InstrumentSettings {
    private audioEngine: AudioEngine;
    private instrument: Instrument;
    private settings: InstrumentSettingsParams;

    constructor(audioEngine: AudioEngine, instrument: Instrument) {
        this.audioEngine = audioEngine;
        this.instrument = instrument;
        this.settings = this.getDefaultSettings();
    }

    private getDefaultSettings(): InstrumentSettingsParams {
        return {
            release: 2,
            volume: 1,
            tuning: {
                preset: 'standard',
            },
            stringsCount: 6,
        };
    }

    // Обновление настроек
    public updateSettings(newSettings: Partial<InstrumentSettingsParams>) {
        this.settings = { ...this.settings, ...newSettings };
    }

    public setRelease(value: number) {
        this.settings.release = value;
        this.audioEngine.setRelease(value);
    }

    public setVolume(value: number) {
        this.settings.volume = value;
        this.audioEngine.setVolume(value);
    }

    public setTuning(preset: ITuningPreset, customTuning?: string[]) {
        const tunings = {
            standard: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
            dropD: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
            openG: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4']
        };

        if(preset === 'standard' || preset === 'dropD' || preset === 'openG'){
            this.instrument.setTuning(tunings[preset]);
        }else{
            if (customTuning) {
                this.instrument.setTuning(customTuning);
            }
        }
    }

    public getCurrentSettings(): InstrumentSettingsParams {
        return this.settings;
    }
}

export default InstrumentSettings;