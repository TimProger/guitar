import { IFret, IChord, IStringNames } from '../../types/guitar.types';
import { KeyboardController } from '../keyboard/KeyboardController';
import { generateNoteSequence } from '../utils/fretUtils';
import { SampleManager } from '../audio/SampleManager';
import { AudioEngine } from '../audio/AudioEngine';

type IStrings = Record<IStringNames, { frets: Record<string, IFret> }>

export class Instrument {
  private keyboardController: KeyboardController;
  private sampleManager: SampleManager;
  private audioEngine: AudioEngine;
  private _strings: IStrings;

  // Возвращает все струны с их ладами (копия _strings)
  public getStringsData(): IStrings {
    return JSON.parse(JSON.stringify(this._strings)); // Возвращаем глубокую копию
  }

  // Возвращает массив всех ладов для конкретной струны с их состоянием.
  public getStringState(stringName: IStringNames) { 
    return Object.entries(this._strings[stringName].frets).map(([index, fret]) => ({
      index: parseInt(index),
      note: fret.note,
      isPressed: fret.isPressed
    }));
  }

  // Возвращает состояние всех струн гитары в виде объекта. (E1: [{ index: 1, note: "F4", isPressed: false }, ...], ...)
  public getAllStringsState() {
    return Object.keys(this._strings).reduce((acc, stringName) => ({
      ...acc,
      [stringName]: this.getStringState(stringName as IStringNames)
    }), {} as Record<IStringNames, Array<{index: number, note: string, isPressed: boolean}>>);
  }

  // Получить все зарегистрированные аккорды
  public getRegisteredChords(): Record<number, IChord> {
    return this.keyboardController.getChords();
  }

  // Получить конкретный аккорд по ID
  public getChordById(id: number): IChord | undefined {
    return this.keyboardController.getChord(id);
  }

  constructor() {
    this.sampleManager = new SampleManager('guitar-acoustic'); // Тип гитары
    this.audioEngine = new AudioEngine(this.sampleManager);
    this.audioEngine.init()
    this.keyboardController = new KeyboardController(this.audioEngine);
    this._strings = this.initStrings();
  }

  public setForceUpdate(callback: () => void) {
    this.keyboardController.setForceUpdate(callback);
  }

  private initStrings() {

    // Генерация нот под каждую струну
    const newStrings = {
      E1: { frets: this.generateFrets(generateNoteSequence("E4", 20)) },
      B: { frets: this.generateFrets(generateNoteSequence("B3", 20)) },
      G: { frets: this.generateFrets(generateNoteSequence("G3", 20)) },
      D: { frets: this.generateFrets(generateNoteSequence("D3", 20)) },
      A: { frets: this.generateFrets(generateNoteSequence("A2", 20)) },
      E2: { frets: this.generateFrets(generateNoteSequence("E2", 20)) }
    };

    // Задаю 0 ладу каждой струны isPressed = true
    Object.values(newStrings).forEach(string => {
      const firstFretKey = Object.keys(string.frets)[0];
      string.frets[firstFretKey].isPressed = true;
    });
    
    return newStrings
  }

  private generateFrets(notes: string[]): Record<string, IFret> {
    return notes.reduce((acc, note, index) => ({
      ...acc,
      [index]: { index, note, isPressed: false }
    }), {});
  }

  public startRegistratingChord(){
    const chord: IChord = {
      name: '',
      strings: {
        E1: { index: 0, note: '', isPressed: false},
        B: { index: 0, note: '', isPressed: false},
        G: { index: 0, note: '', isPressed: false},
        D: { index: 0, note: '', isPressed: false},
        A: { index: 0, note: '', isPressed: false},
        E2: { index: 0, note: '', isPressed: false},
      },
    };

    const strings = this.getStringsData();
    
    // Безопасный перебор струн
    (Object.keys(strings) as IStringNames[]).forEach((stringName) => {
      const string = strings[stringName];
      
      // Перебор ладов с проверкой типа
      Object.entries(string.frets).forEach(([_fretIndex, currentFret]) => {
        if (currentFret.isPressed) {
          chord.strings[stringName] = currentFret;
        }
      });
    });

    this.keyboardController.setStatus('registrating')
    this.keyboardController.setCurrentRegisterChord(chord)
  }

  public async pressFret(stringName: IStringNames, fretIndex: number) {

    // Сброс всех ладов на струне
    Object.values(this._strings[stringName].frets).forEach(fret => {
      fret.isPressed = false;
    });

    // Обновляем состояние ладов
    this._strings[stringName].frets[fretIndex].isPressed = true;

    // Получаем ноту для воспроизведения
    const note = this._strings[stringName].frets[fretIndex].note;
    
    // Воспроизводим звук
    await this.playNote(note);
  }

  private async playNote(note: string) {
    try {
      // const fullNote = `${this.currentInstrument}/${note}.mp3`;
      // const url = this.sampleManager.getSampleUrl(fullNote);
      await this.audioEngine.playSample(note);
    } catch (error) {
      console.error('Error playing note:', note, error);
    }
  }
}