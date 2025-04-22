import React from 'react';
import classNames from 'classnames';
import s from './styles.module.scss';
import { IFret, IStrings } from '@/types/guitar.types';

// Типизация пропсов для компонента String
interface StringProps {
    name: keyof IStrings;
    frets: { [note: string]: IFret };
    pressFret: (stringName: keyof IStrings, fretId: string, noteIndex: number) => void;
    index: number;
}

// Компонент для отображения струны
const StringComponent: React.FC<StringProps> = ({ name, frets, pressFret, index }) => {
    return (
        <div className={classNames(s.string, s[`string-${index + 1}`])}>
            <div className={s.frets}>
                {Object.keys(frets).map((fretId, noteIndex) => (
                    <div
                        key={fretId}
                        className={classNames(s.fret, s[`fret-${noteIndex}`], {
                            [s.fret_pressed]: frets[fretId].isPressed,
                        })}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && pressFret(name, frets[fretId].note, noteIndex)
                        }
                        role="button"
                        tabIndex={0}
                        onClick={() => pressFret(name, frets[fretId].note, noteIndex)}
                    >
                        {frets[fretId].note}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StringComponent;
