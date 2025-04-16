import React, { useState } from 'react';
import s from './styles.module.scss';
import classNames from 'classnames';

interface ISettingsProps {
    volume: number;
    tuning: string[];
    onVolumeChange: (value: number) => void;
    onTuningChange: (tuning: string[]) => void;
}

const strings = ['e', 'A', 'D', 'G', 'B', 'E']
export const NOTES = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
export const NUMBERS = [1, 2, 3, 4, 5, 6];

const Settings: React.FC<ISettingsProps> = ({ volume, tuning, onVolumeChange, onTuningChange }) => {
    const [localTuning, setLocalTuning] = useState<{
        note: string;
        number: number;
    }[]>(tuning.map((note, index) => ({
        index,
        note: note.includes('#') ? note.split('#')[0] : note.split('')[0],
        number: note.includes('#') ? +note.split('#')[1] : +note.split('')[1],
    })).reverse());

    const handleTuningChange = (type: 'note' | 'number', index: number, value: string) => {
        switch (type) {
            case 'note':
                const updatedNote = { ...localTuning[index], note: value };
                const updatedTuning = [...localTuning];
                updatedTuning[index] = updatedNote;
                setLocalTuning(updatedTuning);
                onTuningChange(updatedTuning.map(({ note, number }) => `${note}${number}`).reverse());
                break;
            case 'number':
                const updatedNumber = { ...localTuning[index], number: +value };
                const updatedTuningNumber = [...localTuning];
                updatedTuningNumber[index] = updatedNumber;
                setLocalTuning(updatedTuningNumber);
                onTuningChange(updatedTuningNumber.map(({ note, number }) => `${note}${number}`).reverse());
                break;
            default:
                break;
        }
    };

    return (
        <div className={s.settings}>
            <div className={classNames(s.setting, s.tuning)}>
                <label>Tuning</label>
                <div className={s.tuningInputs}>
                    {localTuning
                        .map((note, index) => (
                            <div key={index} className={s.tuningInput}>
                                <label>{strings[index]}</label>
                                <select
                                    value={note.note}
                                    onChange={(e) => handleTuningChange('note', index, e.target.value)}
                                    className={`note-select`}
                                    >
                                    {NOTES.map((note) => (
                                        <option key={note} value={note}>
                                        {note}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={note.number}
                                    onChange={(e) => handleTuningChange('number', index, e.target.value)}
                                    className={`note-select`}
                                    >
                                    {NUMBERS.map((number) => (
                                        <option key={number} value={number}>
                                            {number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={classNames(s.setting, s.volume)}>
                <label>Volume</label>
                <div className={s.volumeControl}>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={volume}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                    />
                    <span>{volume}</span>
                </div>
            </div>
            <div className={classNames(s.setting, s.volume)}>
                <label>Release</label>
                <div className={s.volumeControl}>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={volume}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                    />
                    <span>{volume}</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;