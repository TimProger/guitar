import { createSampleMap } from "./utils";

type SampleMap = Record<string, string>;

export const NOTES = [
  'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'
];

export class SampleManager {
  private samplesCache: Map<string, SampleMap> = new Map();
  private baseUrl = '/samples';
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

    await this.validateSamples(sampleMap);

    return sampleMap;
  }
  
  // Проверка наличия сэмплов в папке
  // Если сэмпл отсутствует, он будет сгенерирован вручную позже
  private async validateSamples(samples: Record<string, string>) {
    for (const [note, path] of Object.entries(samples)) {
      const response = await fetch(`${this.baseUrl}/${path}`);
      if (!response.ok) {
        console.error(`Sample missing: ${note}`);
        delete samples[note];
      }
    }
  }

  // Получение URL для сэмпла
  getSampleUrl(note: string): string {
    return `${this.baseUrl}${note}`;
  }
}