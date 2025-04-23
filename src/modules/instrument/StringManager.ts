import { IStrings, IStringNames, IGuitarObj } from '../../types/guitar.types';
import { generateNoteSequence, generateFrets } from '../utils/fretUtils';

export class StringManager {
    private strings: IStrings;
    protected forceUpdate: (() => void) | null = null; // Колбек для обновления UI

    constructor(private guitarObj: IGuitarObj) {
        this.strings = this.initStrings();
    }

    public setForceUpdate(callback: () => void) {
        this.forceUpdate = callback;
    }

    // Генерация имён струн на основе их количества
    private getStringNames(): IStringNames[] {
        const allNames: IStringNames[] = ['E2', 'A', 'D', 'G', 'B', 'E1'];
        return allNames.slice(0, this.guitarObj.stringsCount).reverse();
    }

    private initStrings(): IStrings {
        const stringNames = this.getStringNames();

        return stringNames.map((name, index) => ({
            name,
            frets: generateFrets(
                generateNoteSequence(this.guitarObj.tuning[index], this.guitarObj.fretsCount)
            ),
        }));
    }

    public pressFret(stringIndex: number, fretIndex: number): string {
        const string = this.strings[stringIndex];

        string.frets.forEach((fret) => {
            fret.isPressed = false;
        });

        string.frets[fretIndex].isPressed = true;
        return string.frets[fretIndex].note;
    }

    public getStringsData(): IStrings {
        return JSON.parse(JSON.stringify(this.strings));
    }

    public getCurrentTuning(): string[] {
        return this.guitarObj.tuning;
    }

    public setTuning(newTuning: string[]) {
        this.guitarObj.tuning = [...newTuning];
        this.strings = this.initStrings();
        this.forceUpdate?.(); // Обновляем UI
    }
}
