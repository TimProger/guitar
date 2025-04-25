import { IChord, IGuitarObj, IStrings } from '../../types/guitar.types';
import { KeyboardController } from '../keyboard/KeyboardController';
import { SampleManager } from '../audio/SampleManager';
import { AudioEngine } from '../audio/AudioEngine';
import { StringManager } from './StringManager';
import { ChordManager } from '../keyboard/ChordManager';
import { InstrumentUtilities } from './InstrumentUtilities';
import { getChordType } from '../utils/chordUtils';

export class InstrumentController {
    private stringManager: StringManager; // Менеджер струн
    private chordManager: ChordManager; // Менеджер аккордов
    private audioEngine: AudioEngine; // Модуль для работы со звуком
    private keyboardController: KeyboardController; // Модуль для работы с клавиатурой
    private sampleManager: SampleManager; // Модуль для создания путей к сэмплам
    private utilities: InstrumentUtilities; // Утилиты для работы с инструментом
    protected forceUpdate: (() => void) | null = null; // Колбек для обновления UI
    private guitarObjArray: IGuitarObj[] = [
        {
            type: 'guitar',
            name: 'Acoustic Guitar',
            id: 'guitar-acoustic',
            tuning: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
            stringsCount: 6,
            fretsCount: 21,
            image: 'acoustic-guitar.png',
        },
        {
            type: 'guitar',
            name: 'Electric Guitar',
            id: 'guitar-electric',
            tuning: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
            stringsCount: 6,
            fretsCount: 24,
            image: 'electric-guitar.png',
        },
        {
            type: 'guitar',
            name: 'Bass Guitar',
            id: 'guitar-bass',
            tuning: ['G2', 'D2', 'A1', 'E1'],
            stringsCount: 4,
            fretsCount: 24,
            image: 'bass-guitar.png',
        },
    ];
    private guitarObj: IGuitarObj = this.guitarObjArray[0];

    constructor() {
        this.sampleManager = new SampleManager(this.guitarObj.id);
        this.stringManager = new StringManager(this.guitarObj);
        this.chordManager = new ChordManager();
        this.audioEngine = new AudioEngine(this.sampleManager);
        this.keyboardController = new KeyboardController(this.chordManager, this.audioEngine);
        this.utilities = new InstrumentUtilities(this);

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

    public getGuitarObjArray() {
        return this.guitarObjArray;
    }

    public getGuitarObj() {
        return this.guitarObj;
    }

    public setGuitarObj(guitarObj: IGuitarObj) {
        this.guitarObj = guitarObj;
        this.sampleManager = new SampleManager(this.guitarObj.id);
        this.stringManager = new StringManager(this.guitarObj);
        this.chordManager = new ChordManager();
        this.audioEngine = new AudioEngine(this.sampleManager);
        this.keyboardController = new KeyboardController(this.chordManager, this.audioEngine);
        this.utilities = new InstrumentUtilities(this);
        this.initialize();
        this.forceUpdate?.();
    }

    public utilityMethods(): InstrumentUtilities {
        return this.utilities;
    }

    public getSampleManager(): SampleManager {
        return this.sampleManager;
    }

    public getChordManager(): ChordManager {
        return this.chordManager;
    }

    public getAudioEngine(): AudioEngine {
        return this.audioEngine;
    }

    public getKeyboardController(): KeyboardController {
        return this.keyboardController;
    }

    public getStringManager(): StringManager {
        return this.stringManager;
    }

    public async pressFret(stringIndex: number, fretIndex: number) {
        const note = this.stringManager.pressFret(stringIndex, fretIndex);
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
            strings: [
                { index: -1, note: '', isPressed: false },
                { index: -1, note: '', isPressed: false },
                { index: -1, note: '', isPressed: false },
                { index: -1, note: '', isPressed: false },
                { index: -1, note: '', isPressed: false },
                { index: -1, note: '', isPressed: false },
            ],
        };

        strings.map((stringName, index) => {
            Object.values(stringName.frets).forEach((fret) => {
                if (fret.isPressed) {
                    chord.strings[index] = fret;
                }
            });
        });

        const uniqueChordNotes = [
            ...new Set(
                Object.values(chord.strings)
                    .filter((note) => note.note)
                    .map((note) => note.note)
            ),
        ];

        const newName = getChordType(uniqueChordNotes);
        console.log(newName, uniqueChordNotes);

        return chord;
    }

    public cleanup() {
        this.audioEngine.cleanup();
        this.keyboardController.cleanup();
    }
}
