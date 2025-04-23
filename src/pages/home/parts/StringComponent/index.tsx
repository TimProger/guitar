import React from 'react';
import classNames from 'classnames';
import s from './styles.module.scss';
import { IFret } from '@/types/guitar.types';

// Типизация пропсов для компонента String
interface StringProps {
    frets: IFret[];
    pressFret: (stringIndex: number, noteIndex: number) => void;
    index: number;
}

// Компонент для отображения струны
const StringComponent: React.FC<StringProps> = ({ frets, pressFret, index }) => {
    return (
        <div className={classNames(s.string, s[`string-${index + 1}`])}>
            <div className={s.frets}>
                {frets.map((fretId, noteIndex) => (
                    <div
                        key={fretId.index}
                        className={classNames(s.fret, s[`fret-${noteIndex}`], {
                            [s.fret_pressed]: frets[noteIndex].isPressed,
                        })}
                        onKeyDown={(e) => e.key === 'Enter' && pressFret(index, noteIndex)}
                        role="button"
                        tabIndex={0}
                        onClick={() => pressFret(index, noteIndex)}
                    >
                        {frets[noteIndex].note}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StringComponent;
