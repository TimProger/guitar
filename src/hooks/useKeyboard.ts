import { KeyboardController } from '@/modules/keyboard/KeyboardController';
import { IChord } from '@/types/guitar.types';
import { useEffect } from 'react';

const keyboardController = new KeyboardController();

export const useKeyboard = () => {
  useEffect(() => {
    return () => keyboardController.cleanup();
  }, []);

  const registerChord = (key: number, chord: IChord) => {
    keyboardController.registerChord(key, chord);
  };

  return {
    registerChord,
    keyboardController
  };
};