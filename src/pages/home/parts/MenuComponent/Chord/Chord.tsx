import React, { useEffect, useState } from 'react';
import s from './styles.module.scss';
import { IChord } from '@/types/guitar.types';
import classNames from 'classnames';
import { StringManager } from '@/modules/instrument/StringManager';

interface ChordDiagramProps {
    selectedChordId: number | null;
    position: number;
    chord: IChord;
    stringsManager: StringManager;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({
    stringsManager,
    position,
    selectedChordId,
    chord,
}) => {
    const [minFret, setMinFret] = useState<number>(0);

    const strings = stringsManager.getStringsData();

    // Функция для вычисления минимального зажатого лада
    const calculateMinFret = (chord: IChord): number => {
        const fretValues = Object.values(chord.strings)
            .filter((string) => string.index > 0)
            .map((string) => string.index);

        return fretValues.length > 0 ? Math.min(...fretValues) : 0;
    };

    // Обновляем minFret при изменении аккорда
    useEffect(() => {
        if (chord) {
            setMinFret(calculateMinFret(chord));
        }
    }, [chord]);

    if (!chord) return <div className={s.chord}></div>; // Если аккорд не передан, ничего не отображаем

    return (
        <div className={classNames(s.chord, { [s.chord_active]: position === selectedChordId })}>
            <div className={s.fretboard}>
                <div className={s['fret-number']}></div>

                {[1, 2, 3, 4].map((fretNum) => (
                    <div key={`fret-${fretNum}`} className={s['fret-label']}>
                        {minFret > 0 ? minFret + fretNum - 1 : fretNum}
                    </div>
                ))}

                {strings.map((stringObj, stringIndex) => {
                    const { index } = chord.strings[stringIndex];
                    // const stringData = stringsManager.getStringsData()[stringIndex];
                    // const pressedFret = stringData.frets.find((fret) => fret.isPressed);
                    // const index = pressedFret ? pressedFret.index : -1;
                    const adjustedIndex = index - minFret + 1;
                    const showMarker = index > 0 && adjustedIndex <= 6;

                    return (
                        <React.Fragment key={stringObj.name}>
                            <div className={s['string-name']}>
                                {stringObj.name === 'E2'
                                    ? 'E'
                                    : stringObj.name === 'E1'
                                      ? 'e'
                                      : stringObj.name}
                            </div>

                            {[1, 2, 3, 4].map((fretNum) => (
                                <div
                                    key={`${stringObj.name}-${fretNum}`}
                                    className={`
                                        ${s.fret} 
                                        ${showMarker && adjustedIndex === fretNum ? s.active : ''}
                                        ${fretNum === 1 && index === -1 ? s.closed : ''}
                                        ${fretNum === 1 && index === 0 ? s.open : ''}
                                        ${fretNum === 4 && index > minFret + 3 ? s.last : ''}
                                    `}
                                    data-fret={fretNum === 4 && index > minFret + 3 ? index : ''}
                                    onClick={() => {
                                        const fretToPress = minFret + fretNum - 1;
                                        stringsManager.pressFret(stringIndex, fretToPress);
                                    }}
                                    tabIndex={0}
                                    role="button"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const fretToPress = minFret + fretNum - 1;
                                            stringsManager.pressFret(stringIndex, fretToPress);
                                        }
                                    }}
                                />
                            ))}
                        </React.Fragment>
                    );
                })}
            </div>
            <div className={s['chord-name']}>{chord.name}</div>
        </div>
    );
};

export default ChordDiagram;
