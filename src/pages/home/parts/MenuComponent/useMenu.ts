import { Instrument } from "@/modules/instrument/Instrument";
import { IChord } from "@/types/guitar.types";
import { useEffect, useState } from "react";

interface IUseMenu {
    instrument: Instrument;
}

export const useMenu = ({instrument}: IUseMenu) => {

    const [page, setPage] = useState<'chords' | 'settings'>('settings')
    const [selectedChordId, setSelectedChordId] = useState<number | null>(null)
    const [activeChords, setActiveChords] = useState<Record<number, IChord>>([])

    const startRegistration = () => {
        instrument.startRegistratingChord()
    }

    useEffect(() => {
        instrument.setForceUpdate(() => {
            setActiveChords({ ...instrument.getRegisteredChords() }); // Создаём новый объект
        });
    }, [instrument]);

    return {
        page,
        setPage,
        activeChords,
        selectedChordId,
        setSelectedChordId,
        startRegistration
    }
}
