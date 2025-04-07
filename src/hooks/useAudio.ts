import { useEffect } from 'react';
import { audioEngine } from '../modules/audio/AudioEngine';

export function useAudio() {
  useEffect(() => {
    audioEngine.init();
    return () => audioEngine.cleanup();
  }, []);

  return {
    setInstrument: (type: string) => audioEngine.setInstrument(type)
  };
}