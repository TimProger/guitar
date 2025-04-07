export type IStringNames = 'E1' | 'B' | 'G' | 'D' | 'A' | 'E2'
export type INotesNames = "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B" | "C" | "C#" | "D" | "D#" | "E" | "F"

// Интерфейс для лада
export interface IFret {
    index: number;
    note: string; // Состояние: зажата ли струна на этом ладу
    isPressed: boolean; // Состояние: зажата ли струна на этом ладу
}

// Интерфейс для струны
export interface IString {
  frets: { [note: string]: IFret };  // Объект, где ключ - нота, а значение - объект с состоянием
}

// Интерфейс для струны
export interface IStrings {
    E1: IString;
    B: IString;
    G: IString;
    D: IString;
    A: IString;
    E2: IString;
}

// Интерфейс для аккорда
export interface IChord {
    name: string;
    strings: {
        E1: IFret;
        B: IFret;
        G: IFret;
        D: IFret;
        A: IFret;
        E2: IFret;
    };
}