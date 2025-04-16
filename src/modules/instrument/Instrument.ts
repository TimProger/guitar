import { IFret, IChord, IStringNames } from '../../types/guitar.types';
import { KeyboardController } from '../keyboard/KeyboardController';
import { generateNoteSequence } from '../utils/fretUtils';
import { SampleManager } from '../audio/SampleManager';
import { AudioEngine } from '../audio/AudioEngine';
import InstrumentSettings from './InstrumentSettings';

export type IStrings = Record<IStringNames, { frets: Record<string, IFret> }>

type ISelectedGuitarType = 'guitar-acoustic'

export class Instrument {
  private keyboardController: KeyboardController;
  private instrumentSettings: InstrumentSettings;
  private sampleManager: SampleManager;
  private audioEngine: AudioEngine;
  private _strings: IStrings;
  private selectedGuitarType: ISelectedGuitarType = 'guitar-acoustic';
  public currentTuning: string[];
  private settingsSubscriptions: (() => void)[] = [];
  private forceUpdateCallback: (() => void) | null = null;

  private getDefaultTuning(): string[] {
    return ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
  }

  public getKeyboardController() {
    return this.keyboardController;
  }

  public getCurrentTuning() {
    return this.currentTuning;
  }  
  
  public setForceUpdate(callback: (() => void)) { // Установка колбэка для обновления компонента
    this.forceUpdateCallback = callback;
    this.keyboardController.setForceUpdate(callback); // Передаем колбэк в KeyboardController
  }

  public triggerUpdate() { // Триггер обновления компонента
    if (this.forceUpdateCallback) {
      this.forceUpdateCallback();
    }
  }

  public setVolume(level: number) {
    this.audioEngine.setVolume(level);
    this.audioEngine.init();
  }

  public setTuning(tuning: string[]) {
    this.currentTuning = [...tuning];
    this._strings = this.initStrings(); // Пересоздаем струны с новым строем
    this.triggerUpdate();
  }

  public dispose() {
    this.settingsSubscriptions.forEach(unsubscribe => unsubscribe());
  }

  // Возвращает все струны с их ладами (копия _strings)
  public getStringsData(): IStrings {
    return JSON.parse(JSON.stringify(this._strings));
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
    this.currentTuning = this.getDefaultTuning()
    this.sampleManager = new SampleManager(this.selectedGuitarType);
    this.audioEngine = new AudioEngine(this.sampleManager);
    this.audioEngine.init()
    this.instrumentSettings = new InstrumentSettings(this.audioEngine, this);
    this.instrumentSettings.setTuning('standard');
    this.keyboardController = new KeyboardController(this.audioEngine);
    this._strings = this.initStrings();

    // Подписка на изменения настроек
    this.settingsSubscriptions.push(
      this.instrumentSettings.subscribe(() => this.triggerUpdate())
    );
  }

  private initStrings() {

    // Генерация нот под каждую струну
    const newStrings = {
      E1: { frets: this.generateFrets(generateNoteSequence(this.currentTuning[5], 21)) },
      B: { frets: this.generateFrets(generateNoteSequence(this.currentTuning[4], 21)) },
      G: { frets: this.generateFrets(generateNoteSequence(this.currentTuning[3], 21)) },
      D: { frets: this.generateFrets(generateNoteSequence(this.currentTuning[2], 21)) },
      A: { frets: this.generateFrets(generateNoteSequence(this.currentTuning[1], 21)) },
      E2: { frets: this.generateFrets(generateNoteSequence(this.currentTuning[0], 21)) },
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
        E2: { index: -1, note: '', isPressed: false},
        A: { index: -1, note: '', isPressed: false},
        D: { index: -1, note: '', isPressed: false},
        G: { index: -1, note: '', isPressed: false},
        B: { index: -1, note: '', isPressed: false},
        E1: { index: -1, note: '', isPressed: false},
      },
    };

    const strings = this.getStringsData();
    
    // Безопасный перебор струн
    (Object.keys(strings) as IStringNames[]).forEach((stringName) => {
      const string = strings[stringName];
      
      // Перебор ладов
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
    this.instrumentSettings.setVolume(6)
    const val = JSON.parse(JSON.stringify(this._strings[stringName].frets[fretIndex]))

    // Сброс всех ладов на струне
    Object.values(this._strings[stringName].frets).forEach(fret => {
      fret.isPressed = false;
    });

    // Установка состояния для конкретного лада
    this._strings[stringName].frets[fretIndex].isPressed = !val.isPressed;

    // Получаем ноту для воспроизведения
    const note = this._strings[stringName].frets[fretIndex].note;
    
    if(!val.isPressed){
      // Воспроизводим звук
      await this.playNote(note);
    }

    this.triggerUpdate(); // Обновляем состояние компонента
  }

  private async playNote(note: string) {
    try {
      await this.audioEngine.playSample(note);
    } catch (error) {
      console.error('Error playing note:', note, error);
    }
  }
}