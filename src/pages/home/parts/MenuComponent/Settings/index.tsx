import React, { useEffect, useState } from 'react';
import s from './styles.module.scss';
import classNames from 'classnames';
import { tuningPresets } from '../../../../../modules/instrument/InstrumentSettings';

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
    const [release, setRelease] = useState<number>(1);
    const [presets, _] = useState<typeof tuningPresets>(tuningPresets);
    const [preset, setPreset] = useState<keyof typeof tuningPresets>('standard');

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

    useEffect(() => {
        onTuningChange(JSON.parse(JSON.stringify(presets[preset])))
        setLocalTuning(presets[preset].map((note, index) => ({
            index,
            note: note.includes('#') ? note.split('#')[0] : note.split('')[0],
            number: note.includes('#') ? +note.split('#')[1] : +note.split('')[1],
        })).reverse());
    }, [preset]);

    return (
        <div className={s.settings}>
            <div className={classNames(s.setting, s.tuning)}>
                <label>Tuning</label>
                <select value={preset} onChange={(e) => {
                    setPreset(e.target.value as keyof typeof tuningPresets);
                }}>
                    {Object.keys(tuningPresets).map((preset) => (
                    <option key={preset} value={preset}>
                        {preset}
                    </option>
                    ))}
                </select>
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
                        value={release}
                        onChange={(e) => setRelease(Number(e.target.value))}
                    />
                    <span>{release}</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;