export type IStringNames = 'E1' | 'B' | 'G' | 'D' | 'A' | 'E2';
export type INotesNames =
    | 'E'
    | 'F'
    | 'F#'
    | 'G'
    | 'G#'
    | 'A'
    | 'A#'
    | 'B'
    | 'C'
    | 'C#'
    | 'D'
    | 'D#'
    | 'E'
    | 'F';

// Интерфейс для струны
export interface IString {
    frets: { [note: string]: IFret }; // Объект, где ключ - нота, а значение - объект с состоянием
}

// Интерфейс для лада
export interface IFret {
    index: number;
    note: string; // Состояние: зажата ли струна на этом ладу
    isPressed: boolean; // Состояние: зажата ли струна на этом ладу
}

// Интерфейс для струны
export type IStrings = {
    name: IStringNames;
    frets: IFret[];
}[];

// Интерфейс для аккорда
export interface IChord {
    name: string;
    strings: IFret[];
}

export interface IActiveChord {
    id: number;
    index: number;
    chord: IChord;
    timestamp: number;
}

export interface IGuitarObj {
    type: string;
    name: string;
    id: string;
    tuning: string[];
    stringsCount: number;
    fretsCount: number;
    image: string;
}
