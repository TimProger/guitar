import { IChord } from '@/types/guitar.types';

export const DEFAULT_KEYBINDS = {
  CHORD_SELECTION: {
    min: '1',
    max: '6'
  },
  CHORD_PLAY: {
    asc: 'ArrowUp',
    desc: 'ArrowDown'
  }
};

export const createChordKeybindMap = (chords: IChord[]) => {
  return chords.reduce((map, chord, index) => {
    if (index >= 6) return map; // Ограничение 6 аккордов
    map.set(index, chord);
    return map;
  }, new Map<number, IChord>());
};