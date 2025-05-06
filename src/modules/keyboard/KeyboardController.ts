import { IChord } from '@/types/guitar.types';
import { DEFAULT_KEYBINDS } from './KeybindPresets';
import { AudioEngine } from '../audio/AudioEngine';
import { ChordManager } from './ChordManager';

export type KeyboardControllerStatus =
    | 'disabled' // Полностью выключен
    | 'idle' // Ожидание действий (работает по умолчанию)
    | 'recording' // тест
    | 'registrating' // Регистрация аккорда
    | 'playing'; // Аккорд выбран и готов к проигрыванию

export class KeyboardController {
    private status: KeyboardControllerStatus = 'idle';
    private currentRegisterChord: IChord | null = null;
    protected forceUpdate: (() => void) | null = null; // Колбек для обновления UI

    constructor(
        private chordManager: ChordManager,
        private audioEngine: AudioEngine
    ) {
        this.setupEventListeners();
    }

    public getSelectedChordId() {
        return this.chordManager.getCurrentChord()?.id ?? null;
    }

    public getRegisteredChords() {
        return this.chordManager.getChords();
    }

    public setForceUpdate(callback: () => void) {
        this.forceUpdate = callback;
    }

    public startChordRegistration(chord: IChord) {
        this.status = 'registrating';
        this.currentRegisterChord = chord;
    }

    private setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (
            this.status === 'registrating' &&
            e.key >= DEFAULT_KEYBINDS.CHORD_SELECTION.min &&
            e.key <= DEFAULT_KEYBINDS.CHORD_SELECTION.max
        ) {
            this.registerChord(e);
            return;
        }

        if (
            e.key >= DEFAULT_KEYBINDS.CHORD_SELECTION.min &&
            e.key <= DEFAULT_KEYBINDS.CHORD_SELECTION.max
        ) {
            this.selectChord(e);
            this.forceUpdate?.();
        }

        // @ts-ignore
        if (!!DEFAULT_KEYBINDS.CHORD_NOTE_PLAY[e.code]) {
            // @ts-ignore
            const note = DEFAULT_KEYBINDS.CHORD_NOTE_PLAY[e.code];
            this.playCurrentChordNote(note);
        }

        if ([DEFAULT_KEYBINDS.CHORD_PLAY.asc, DEFAULT_KEYBINDS.CHORD_PLAY.desc].includes(e.key)) {
            this.playCurrentChord(e.key === DEFAULT_KEYBINDS.CHORD_PLAY.asc ? 'asc' : 'desc');
        }
    };

    private registerChord(e: KeyboardEvent) {
        if (!this.currentRegisterChord) return;

        this.chordManager.registerChord(
            +e.key - 1,
            JSON.parse(JSON.stringify(this.currentRegisterChord))
        );
        this.status = 'playing';
        this.currentRegisterChord = null;
        this.forceUpdate?.();
    }

    private handleKeyUp = (e: KeyboardEvent) => {
        if (
            this.status === 'playing' &&
            e.key >= DEFAULT_KEYBINDS.CHORD_SELECTION.min &&
            e.key <= DEFAULT_KEYBINDS.CHORD_SELECTION.max
        ) {
            this.chordManager.selectChord(-1);
            this.forceUpdate?.();
        }
    };

    private selectChord(e: KeyboardEvent) {
        this.chordManager.selectChord(+e.key - 1);
        this.forceUpdate?.();
    }

    private playCurrentChord(direction: 'asc' | 'desc') {
        const currentChord = this.chordManager.getCurrentChord();
        if (!currentChord) return;

        const notes = Object.values(currentChord.chord.strings)
            .filter((note) => note.note)
            .map((note) => note.note);

        const ordered = direction === 'asc' ? [...notes].reverse() : notes;

        ordered.forEach((note, index) => {
            setTimeout(() => this.audioEngine.playSample(note), index * 25);
        });
    }

    private playCurrentChordNote(index: number) {
        const currentChord = this.chordManager.getCurrentChord();
        if (!currentChord) return;

        const note = currentChord.chord.strings[index];
        if (note) {
            this.audioEngine.playSample(note.note);
        }
    }

    public cleanup() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}
