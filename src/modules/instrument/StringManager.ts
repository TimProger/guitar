import { IStrings, IStringNames } from '../../types/guitar.types';
import { generateNoteSequence, generateFrets } from '../utils/fretUtils';

export class StringManager {
  private strings: IStrings;
  protected forceUpdate: (() => void) | null = null; // Колбек для обновления UI

  constructor(private tuning: string[]) {
    this.strings = this.initStrings();
  }

  public setForceUpdate(callback: () => void) {
    this.forceUpdate = callback;
  }

  private initStrings(): IStrings {
    const newStrings = {
      E1: { frets: generateFrets(generateNoteSequence(this.tuning[5], 21)) },
      B: { frets: generateFrets(generateNoteSequence(this.tuning[4], 21)) },
      G: { frets: generateFrets(generateNoteSequence(this.tuning[3], 21)) },
      D: { frets: generateFrets(generateNoteSequence(this.tuning[2], 21)) },
      A: { frets: generateFrets(generateNoteSequence(this.tuning[1], 21)) },
      E2: { frets: generateFrets(generateNoteSequence(this.tuning[0], 21)) },
    };

    Object.values(newStrings).forEach(string => {
      string.frets[0].isPressed = true;
    });
    
    return newStrings;
  }

  public pressFret(stringName: IStringNames, fretIndex: number): string {
    const string = this.strings[stringName];
    
    Object.values(string.frets).forEach(fret => {
      fret.isPressed = false;
    });

    string.frets[fretIndex].isPressed = true;
    return string.frets[fretIndex].note;
  }

  public getStringsData(): IStrings {
    return JSON.parse(JSON.stringify(this.strings));
  }

  public getCurrentTuning(): string[] {
    return this.tuning;
  }

  public setTuning(newTuning: string[]) {
    this.tuning = [...newTuning];
    this.strings = this.initStrings();
    this.forceUpdate?.(); // Обновляем UI
  }
}