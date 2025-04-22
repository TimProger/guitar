import { IFret, IChord, IStringNames } from '../../types/guitar.types';
import { KeyboardController } from '../keyboard/KeyboardController';
import { SampleManager } from '../audio/SampleManager';
import { AudioEngine } from '../audio/AudioEngine';
import { StringManager } from './StringManager';
import { ChordManager } from '../keyboard/ChordManager';

export type IStrings = Record<IStringNames, { frets: Record<string, IFret> }>

export class InstrumentController {
  private stringManager: StringManager;
  private chordManager: ChordManager;
  private audioEngine: AudioEngine;
  private keyboardController: KeyboardController;
  private sampleManager: SampleManager;
  protected forceUpdate: (() => void) | null = null; // Колбек для обновления UI
  

  constructor() {
    const defaultTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
    this.sampleManager = new SampleManager('guitar-acoustic');
    this.stringManager = new StringManager(defaultTuning);
    this.chordManager = new ChordManager();
    this.audioEngine = new AudioEngine(this.sampleManager);
    this.keyboardController = new KeyboardController(this.chordManager, this.audioEngine);
    
    this.initialize();
  }

  private async initialize() {
    await this.audioEngine.init();
  }

  public setForceUpdate(callback: () => void) {
    this.keyboardController.setForceUpdate(callback);
    this.stringManager.setForceUpdate(callback);
    this.forceUpdate = callback;
  }
  
  public setVolume(level: number) {
    this.audioEngine.setVolume(level);
  }

  public getKeyboardController(): KeyboardController {
    return this.keyboardController;
  }

  public getStringManager(): StringManager {
    return this.stringManager;
  }

  public async pressFret(stringName: IStringNames, fretIndex: number) {
    const note = this.stringManager.pressFret(stringName, fretIndex);
    await this.audioEngine.playSample(note);
    this.forceUpdate?.(); // Обновляем UI
  }

  public startChordRegistration() {
    const strings = this.stringManager.getStringsData();
    const chord = this.createChordFromStrings(strings);
    this.keyboardController.startChordRegistration(chord);
  }

  private createChordFromStrings(strings: IStrings): IChord {
    const chord: IChord = {
      name: '',
      strings: {
        E2: { index: -1, note: '', isPressed: false },
        A: { index: -1, note: '', isPressed: false },
        D: { index: -1, note: '', isPressed: false },
        G: { index: -1, note: '', isPressed: false },
        B: { index: -1, note: '', isPressed: false },
        E1: { index: -1, note: '', isPressed: false },
      },
    };

    (Object.keys(strings) as IStringNames[]).forEach((stringName) => {
      Object.values(strings[stringName].frets).forEach(fret => {
        if (fret.isPressed) {
          chord.strings[stringName] = fret;
        }
      });
    });

    return chord;
  }

  public cleanup() {
    this.audioEngine.cleanup();
    this.keyboardController.cleanup();
  }
}