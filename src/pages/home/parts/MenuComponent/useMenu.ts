import { $api } from '../../../../http/axios';
import { InstrumentController } from '@/modules/instrument/InstrumentController';
import { IChord, IGuitarObj, IStrings } from '@/types/guitar.types';
import { useEffect, useState } from 'react';

interface IUseMenu {
    setStringsData: (data: IStrings) => void;
    instrument: InstrumentController;
}

type PageType = 'chords' | 'settings';

interface IUseMenuReturn {
    volume: number;
    tuning: string[];
    updateVolume: (value: number) => void;
    updateTuning: (newTuning: string[]) => void;
    page: PageType;
    setPage: (page: PageType) => void;
    activeChords: Record<number, IChord>;
    selectedChordId: number | null;
    setSelectedChordId: (id: number | null) => void;
    startRegistration: () => void;
    guitarObjArray: IGuitarObj[];
    selectedGuitarObj: IGuitarObj;
    isRecording: boolean;
    handleRecordingToggle: () => void;
    isPlaying: boolean;
    playRecordedNotesHandler: () => void;
    isUploading: boolean;
    uploadRecordedNotesHandler: () => void;
}

export const useMenu = ({ setStringsData, instrument }: IUseMenu): IUseMenuReturn => {
    const [page, setPage] = useState<'chords' | 'settings'>('settings');
    const [selectedChordId, setSelectedChordId] = useState<number | null>(null);
    const [activeChords, setActiveChords] = useState<Record<number, IChord>>([]);
    const [timeoutId, setTimeoutId] = useState<number>(-1);
    const [volume, setVolume] = useState<number>(1);
    const [selectedGuitarObj, setSelectedGuitarObj] = useState<IGuitarObj>(
        instrument.getGuitarObj()
    );
    const [guitarObjArray, setGuitarObjArray] = useState<IGuitarObj[]>(
        instrument.getGuitarObjArray()
    );
    const [tuning, setTuning] = useState<string[]>(
        instrument.getStringManager().getCurrentTuning()
    );
    const [_, forceUpdate] = useState({});
    const triggerUpdate = () => forceUpdate({});

    const startRegistration = () => {
        instrument.startChordRegistration();
        setSelectedChordId(-1);
    };
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    useEffect(() => {
        instrument.setForceUpdate(() => {
            setGuitarObjArray(JSON.parse(JSON.stringify(instrument.getGuitarObjArray()))); // Создаём новый объект
            setSelectedGuitarObj(JSON.parse(JSON.stringify(instrument.getGuitarObj()))); // Создаём новый объект
            setSelectedChordId(instrument.getKeyboardController().getSelectedChordId()); // Создаём новый объект
            setActiveChords({ ...instrument.getKeyboardController().getRegisteredChords() }); // Создаём новый объект
            setTuning([...instrument.getStringManager().getCurrentTuning()]); // Обновляем строй
            setStringsData(instrument.getStringManager().getStringsData()); // Обновляем струны
            triggerUpdate(); // Запускаем обновление компонента
        });
    }, [setStringsData]);

    const handleRecordingToggle = () => {
        if (isRecording) {
            const recordedNotes = instrument.stopRecording();
            console.log('Recorded notes:', recordedNotes);
            setIsRecording(false);
        } else {
            instrument.startRecording();
            setIsRecording(true);
        }
    };

    const playRecordedNotesHandler = () => {
        if (isRecording) return;
        setIsPlaying(true);
        instrument.getAudioEngine().playRecordedNotes(() => setIsPlaying(false));
    };

    const uploadRecordedNotesHandler = () => {
        if (isRecording) return;
        setIsUploading(true);
        const recordedNotes = instrument
            .getAudioEngine()
            .getRecordedNotes()
            .map((el) => {
                return {
                    ...el,
                    duration: el.duration ? +el.duration?.replace('n', '') : 8,
                };
            });
        $api.post('/midi/generate', {
            name: instrument.getGuitarObj().name,
            instrument_name: instrument.getGuitarObj().name,
            notes: recordedNotes,
        })
            .then((res) => {
                console.log('Uploaded notes:', res);
            })
            .finally(() => {
                setIsUploading(false);
            });
    };

    const updateVolume = (value: number) => {
        setVolume(value);
        window.clearTimeout(timeoutId);
        let id = window.setTimeout(() => {
            instrument.utilityMethods().setVolume(value);
        }, 500);
        setTimeoutId(id);
    };

    const updateTuning = (newTuning: string[]) => {
        instrument.getStringManager().setTuning(newTuning);
    };

    return {
        volume,
        tuning,
        updateVolume,
        updateTuning,
        page,
        setPage,
        activeChords,
        selectedChordId,
        setSelectedChordId,
        startRegistration,
        guitarObjArray,
        selectedGuitarObj,
        isRecording,
        handleRecordingToggle,
        isPlaying,
        playRecordedNotesHandler,
        isUploading,
        uploadRecordedNotesHandler,
    };
};
