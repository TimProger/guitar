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
    };
};
