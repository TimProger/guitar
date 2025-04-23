import React from 'react';
// import { IChord } from '@/types/guitar.types';
import s from './styles.module.scss';
import classNames from 'classnames';
import { useMenu } from './useMenu';
import { InstrumentController } from '@/modules/instrument/InstrumentController';
import Chord from './Chord/Chord';
import Settings from './Settings';

interface IMenuProps {
    setStringsData: any;
    instrument: InstrumentController;
}

const MenuComponent: React.FC<IMenuProps> = ({ setStringsData, instrument }) => {
    const {
        page,
        setPage,
        activeChords,
        selectedChordId,
        volume,
        tuning,
        updateVolume,
        updateTuning,
        startRegistration,
    } = useMenu({ setStringsData, instrument });

    const displayPages = () => {
        switch (page) {
            case 'chords':
                const chordPositions = Array.from({ length: 8 }, (_, i) => i);
                return (
                    <div className={s.chords}>
                        <div
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) => e.key === 'Enter' && startRegistration()}
                            onClick={() => startRegistration()}
                            className={classNames(s.chord, s.chord_add, {
                                [s.chord_active]: selectedChordId === -1,
                            })}
                        >
                            +
                        </div>
                        {chordPositions.map((position) => {
                            return (
                                <Chord
                                    selectedChordId={selectedChordId}
                                    position={position}
                                    key={position}
                                    chord={activeChords[position]}
                                    stringsManager={instrument.getStringManager()}
                                />
                            );
                        })}
                    </div>
                );
            case 'settings':
                return (
                    <Settings
                        volume={volume}
                        tuning={tuning}
                        onVolumeChange={updateVolume}
                        onTuningChange={updateTuning}
                    />
                );
        }
    };

    return (
        <div className={s.menu}>
            <div className={s.container}>
                <div className={s.tabs}>
                    <div
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setPage('settings')}
                        role="button"
                        onClick={() => setPage('settings')}
                    >
                        Настройки
                    </div>
                    <div
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setPage('chords')}
                        role="button"
                        onClick={() => setPage('chords')}
                    >
                        Аккорды
                    </div>
                </div>
                <div className={s.page}>{displayPages()}</div>
            </div>
        </div>
    );
};

export default MenuComponent;
