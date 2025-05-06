import { IGuitarTypes } from '@/types/guitar.types';
import { instrumentNotes } from '../data';

type SampleMap = Record<string, string>;

export function createSampleMap(instrumentType: string, NOTES: string[]) {
    const sampleMap: Record<string, string> = {};

    NOTES.forEach((note) => {
        // Преобразуем F# в Fs для имени файла
        const fileName = note.replace('#', 's');
        sampleMap[note] = `${instrumentType}/${fileName}.mp3`;
    });

    return sampleMap;
}

export class SampleManager {
    private samplesCache: Map<string, SampleMap> = new Map();
    private selectedGuitarType: IGuitarTypes = 'guitar-acoustic'; // Тип гитары

    constructor(selectedGuitarType: IGuitarTypes) {
        this.selectedGuitarType = selectedGuitarType;
    }

    // Загрузка сэмплов под переданный тип инструмента
    async loadSamples(): Promise<SampleMap> {
        if (this.samplesCache.has(this.selectedGuitarType)) {
            return this.samplesCache.get(this.selectedGuitarType)!;
        }

        const sampleMap: SampleMap = createSampleMap(
            `/${this.selectedGuitarType}`,
            instrumentNotes[this.selectedGuitarType]
        );

        return sampleMap;
    }
}
