import { createSampleMap } from './utils';

type SampleMap = Record<string, string>;

export const NOTES = [
    'D2',
    'E2',
    'F2',
    'G2',
    'B2',
    'C3',
    'D3',
    'E3',
    'F3',
    'G3',
    'B3',
    'C4',
    'D4',
    'E4',
    'F4',
    'G4',
    'B4',
];

export class SampleManager {
    private samplesCache: Map<string, SampleMap> = new Map();
    private selectedGuitarType = 'guitar-acoustic'; // Тип гитары

    constructor(selectedGuitarType: string) {
        this.selectedGuitarType = selectedGuitarType;
    }

    // Загрузка сэмплов под переданный тип инструмента
    async loadSamples(instrumentType: string): Promise<SampleMap> {
        if (this.samplesCache.has(instrumentType)) {
            return this.samplesCache.get(instrumentType)!;
        }

        const sampleMap: SampleMap = createSampleMap(`/${this.selectedGuitarType}`, NOTES);

        return sampleMap;
    }
}
