import { Instrument } from "@/modules/instrument/Instrument";
import { IChord } from "@/types/guitar.types";
import { useEffect, useState } from "react";

interface IUseMenu {
    setStringsData: any;
    instrument: Instrument;
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
}

export const useMenu = ({setStringsData, instrument}: IUseMenu): IUseMenuReturn => {

    const [page, setPage] = useState<'chords' | 'settings'>('settings')
    const [selectedChordId, setSelectedChordId] = useState<number | null>(null)
    const [activeChords, setActiveChords] = useState<Record<number, IChord>>([])
    const [timeoutId, setTimeoutId] = useState<number>(-1);
    const [volume, setVolume] = useState<number>(1);
    const [tuning, setTuning] = useState<string[]>(instrument.getCurrentTuning());
    const [_, forceUpdate] = useState({});
    const triggerUpdate = () => forceUpdate({});

    const startRegistration = () => {
        instrument.startRegistratingChord()
        setSelectedChordId(-1);
    }

    useEffect(() => {
        instrument.setForceUpdate(() => {
            setSelectedChordId(instrument.getKeyboardController().getSelectedChordId()); // Создаём новый объект
            setActiveChords({ ...instrument.getRegisteredChords() }); // Создаём новый объект
            setTuning([...instrument.getCurrentTuning()]); // Обновляем строй
            setStringsData(instrument.getStringsData()); // Обновляем струны
            triggerUpdate(); // Запускаем обновление компонента
        });
    }, [instrument]);

    const updateVolume = (value: number) => {
        setVolume(value);
        window.clearTimeout(timeoutId);
        let id = window.setTimeout(() => {
            instrument.setVolume(value);
        }, 500);
        setTimeoutId(id)
    };

    const updateTuning = (newTuning: string[]) => {
        setTuning(newTuning.slice().reverse());
        instrument.setTuning(newTuning);
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
        startRegistration
    }
}
