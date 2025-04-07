import { audioEngine } from '../../modules/audio/AudioEngine';
import { IChord } from '@/types/guitar.types';
import { IActiveChord, KeyboardControllerStatus } from './types';

export class KeyboardController {
  private status: KeyboardControllerStatus = 'idle';
  private activeChords: Map<number, IChord> = new Map();
  private currentChord: IActiveChord | null = null;
  private currentRegisterChord: IChord | null = null;
  protected forceUpdate: (() => void) | null = null; // или public

  constructor() {
    this.setupEventListeners();
  }

  // Public API
  public setStatus(status: KeyboardControllerStatus) {
    this.status = status;
    if (status === 'recording') {
      // this.recordingBuffer = { strings: {} } as IChord;
    }
  }

  // Публичный метод для установки колбэка
  public setForceUpdate(callback: () => void) {
    this.forceUpdate = callback;
  }

  public getChord(id: number): IChord | undefined {
    return this.activeChords.get(id);
  }

  public getChords(): Record<number, IChord> {
    return Object.fromEntries(this.activeChords.entries());
  }
  
  public getStatus(): KeyboardControllerStatus {
    return this.status;
  }

  getActiveChords(): Map<number, IChord> {
    return this.activeChords;
  }

  setCurrentRegisterChord(chord: IChord) {
    this.currentRegisterChord = chord
  }

  registerChord(key: number, chord: IChord) {
    this.activeChords.set(key, chord);
  }

  // Event Handling
  private setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.status === 'disabled') return;

    // Режим записи аккорда
    if (this.status === 'registrating' && this.currentRegisterChord && e.key >= '1' && e.key <= '6') {
      this.registerChord(+e.key - 1, this.currentRegisterChord);
      this.currentRegisterChord = null;
      this.forceUpdate?.(); // Уведомляем Emulator о необходимости обновления
      this.setStatus('playing')
      return;
    }

    // Нормальный режим работы
    if (e.key >= '1' && e.key <= '6') {
      this.selectChord(+e.key - 1);
    }

    if (this.currentChord && ['ArrowUp', 'ArrowDown'].includes(e.key)) {
      this.playCurrentChord(e.key === 'ArrowUp' ? 'asc' : 'desc');
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (this.status === 'playing' && e.key >= '1' && e.key <= '6') {
      this.currentChord = null;
    }
  };

  // Core Logic
  private selectChord(key: number) {
    const chord = this.activeChords.get(key);
    if (!chord) return;

    this.currentChord = {
      chord,
      timestamp: Date.now()
    };

    if (this.status === 'idle') {
      this.status = 'playing';
    }
  }

  private playCurrentChord(direction: 'asc' | 'desc') {
    if (!this.currentChord?.chord.strings) return; // Проверяем и strings на null
    console.log(this.currentChord)
    const { strings } = this.currentChord.chord;
    const stringValues = Object.values(strings); // Теперь strings точно объект
    
    const ordered = direction === 'asc' 
      ? [...stringValues].reverse() 
      : stringValues;
  
    console.log(ordered)
    ordered.forEach(({ note }, index) => {
      if (note) {
        setTimeout(() => audioEngine.playSample(note), index * 100);
      }
    });
  }

  private chordListeners: ((chords: Record<number, IChord>) => void)[] = [];

  public subscribeToChords(callback: (chords: Record<number, IChord>) => void) {
    this.chordListeners.push(callback);
    return () => { /* unsubscribe logic */ };
  }

  // private saveChordToBuffer(key: number) {
  //   if (!this.recordingBuffer) return;

  //   // Здесь логика сохранения текущего состояния в буфер
  //   // Например:
  //   // this.recordingBuffer.strings[key] = this.getCurrentFretState();
    
  //   // Автоматический выход из режима после записи всех струн
  //   if (Object.keys(this.recordingBuffer.strings).length === 6) {
  //     this.status = 'idle';
  //     this.saveRecordedChord();
  //   }
  // }

  // private saveRecordedChord() {
  //   if (!this.recordingBuffer) return;
    
  //   // Логика сохранения аккорда (например, в хранилище)
  //   console.log('Recorded chord:', this.recordingBuffer);
  //   this.recordingBuffer = null;
  // }

  cleanup() {
    console.log('removed')
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}