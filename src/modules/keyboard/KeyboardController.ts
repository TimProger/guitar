import { audioEngine } from '../../modules/audio/AudioEngine';
import { IActiveChord, IChord } from '@/types/guitar.types';
import { KeyboardControllerStatus } from './types';

export class KeyboardController {
  private _status: KeyboardControllerStatus = 'idle';
  private _activeChords: Map<number, IChord> = new Map();
  private _currentChord: IActiveChord | null = null;
  private _currentRegisterChord: IChord | null = null;
  protected forceUpdate: (() => void) | null = null;

  constructor() {
    this.setupEventListeners();
  }

  // Public API
  public setStatus(status: KeyboardControllerStatus) {
    this._status = status;
    if (status === 'recording') {
      // this.recordingBuffer = { strings: {} } as IChord;
    }
  }

  // Публичный метод для установки колбэка
  public setForceUpdate(callback: () => void) {
    this.forceUpdate = callback;
  }

  public getChord(id: number): IChord | undefined {
    return this._activeChords.get(id);
  }

  public getChords(): Record<number, IChord> {
    return Object.fromEntries(this._activeChords.entries());
  }
  
  public getStatus(): KeyboardControllerStatus {
    return this._status;
  }

  setCurrentRegisterChord(chord: IChord) {
    this._currentRegisterChord = chord
  }

  registerChord(key: number, chord: IChord) {
    this._activeChords.set(key, chord);
  }

  // Event Handling
  private setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this._status === 'disabled') return;

    // Режим записи аккорда
    if (this._status === 'registrating' && this._currentRegisterChord && e.key >= '1' && e.key <= '6') {
      this.registerChord(+e.key - 1, this._currentRegisterChord);
      this._currentRegisterChord = null;
      this.forceUpdate?.(); // Уведомляем Emulator о необходимости обновления
      this.setStatus('playing')
      return;
    }

    // Нормальный режим работы
    if (e.key >= '1' && e.key <= '6') {
      this.selectChord(+e.key - 1);
    }

    if (this._currentChord && ['ArrowUp', 'ArrowDown'].includes(e.key)) {
      this.playCurrentChord(e.key === 'ArrowUp' ? 'asc' : 'desc');
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (this._status === 'playing' && e.key >= '1' && e.key <= '6') {
      this._currentChord = null;
    }
  };

  // Core Logic
  private selectChord(key: number) {
    const chord = this._activeChords.get(key);
    if (!chord) return;

    this._currentChord = {
      chord,
      timestamp: Date.now()
    };

    if (this._status === 'idle') {
      this._status = 'playing';
    }
  }

  private playCurrentChord(direction: 'asc' | 'desc') {
    if (!this._currentChord?.chord.strings) return; // Проверяем и strings на null
    const { strings } = this._currentChord.chord;
    const stringValues = Object.values(strings); // Теперь strings точно объект
    
    const ordered = direction === 'asc' 
      ? [...stringValues].reverse() 
      : stringValues;
  
    console.log(ordered)
    ordered.forEach(({ note }, index) => {
      if (note) {
        setTimeout(() => audioEngine.playSample(note), index * 50);
      }
    });
  }

  cleanup() {
    console.log('removed')
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}