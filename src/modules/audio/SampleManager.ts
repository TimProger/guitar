import { createSampleMap } from "./utils";

type SampleMap = Record<string, string>;

export const NOTES = [
  'C2', 'D2', 'E2', 'F2', 'G2', 'B2',
  'C3', 'D3', 'E3', 'F3', 'G3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4', 'B4',
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