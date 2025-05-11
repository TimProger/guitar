import { IGuitarObj } from '@/types/guitar.types';

export const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const instrumentNotes = {
    'guitar-acoustic': [
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
    ],
    'guitar-electric': ['A2', 'A3', 'A4', 'A5', 'C3', 'C4', 'C5', 'C6', 'E2'],
    'guitar-bass': ['E1', 'E2', 'E3', 'E4', 'G1', 'G2', 'G3', 'G4'],
};

export const guitarObjArrayData: IGuitarObj[] = [
    {
        type: 'guitar',
        name: 'Acoustic Guitar (steel)',
        id: 'guitar-acoustic',
        tuning: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
        stringsCount: 6,
        fretsCount: 21,
        image: 'acoustic-guitar.png',
    },
    {
        type: 'guitar',
        name: 'Electric Guitar (clean)',
        id: 'guitar-electric',
        tuning: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
        stringsCount: 6,
        fretsCount: 24,
        image: 'electric-guitar.png',
    },
    {
        type: 'guitar',
        name: 'Electric Bass (finger)',
        id: 'guitar-bass',
        tuning: ['G2', 'D2', 'A1', 'E1'],
        stringsCount: 4,
        fretsCount: 24,
        image: 'bass-guitar.png',
    },
];

export const tuningPresets = {
    standard: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
    dropD: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    openG: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
    custom: [], // Кастомный строй
};
