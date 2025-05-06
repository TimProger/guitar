import React, { useEffect, useState } from 'react';
import s from './styles.module.scss';
import classNames from 'classnames';
import { tuningPresets } from '../../../../../modules/data';
import { IGuitarObj } from '@/types/guitar.types';

interface ISettingsProps {
    volume: number;
    tuning: string[];
    onVolumeChange: (value: number) => void;
    onTuningChange: (tuning: string[]) => void;
    guitarObjArray: IGuitarObj[];
    selectedGuitarObj: IGuitarObj;
}

const strings = ['e', 'A', 'D', 'G', 'B', 'E'];
export const NOTES = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
export const NUMBERS = [1, 2, 3, 4, 5];

const Settings: React.FC<ISettingsProps> = ({
    volume,
    tuning,
    onVolumeChange,
    onTuningChange,
    guitarObjArray,
    selectedGuitarObj,
}) => {
    const [localTuning, setLocalTuning] = useState<
        {
            note: string;
            number: number;
        }[]
    >(
        tuning
            .map((note, index) => ({
                index,
                note: note.includes('#') ? note.split('#')[0] : note.split('')[0],
                number: note.includes('#') ? +note.split('#')[1] : +note.split('')[1],
            }))
            .reverse()
    );
    const [release, setRelease] = useState<number>(1);
    const [presets, _] = useState<typeof tuningPresets>(tuningPresets);
    const [oldPreset, setOldPreset] = useState<keyof typeof tuningPresets>('standard');
    const [preset, setPreset] = useState<keyof typeof tuningPresets>('standard');

    const handleTuningChange = (type: 'note' | 'number', index: number, value: string) => {
        switch (type) {
            case 'note':
                const updatedNote = { ...localTuning[index], note: value };
                const updatedTuning = [...localTuning];
                updatedTuning[index] = updatedNote;
                setLocalTuning(updatedTuning);
                onTuningChange(updatedTuning.map(({ note, number }) => `${note}${number}`));
                break;
            case 'number':
                const updatedNumber = { ...localTuning[index], number: +value };
                const updatedTuningNumber = [...localTuning];
                updatedTuningNumber[index] = updatedNumber;
                setLocalTuning(updatedTuningNumber);
                onTuningChange(updatedTuningNumber.map(({ note, number }) => `${note}${number}`));
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        // Проверка на первый рендер
        if (oldPreset !== preset) {
            setOldPreset(preset);
            onTuningChange(JSON.parse(JSON.stringify(presets[preset])));
            setLocalTuning(
                presets[preset].map((note, index) => ({
                    index,
                    note: note.includes('#') ? note.split('#')[0] : note.split('')[0],
                    number: note.includes('#') ? +note.split('#')[1] : +note.split('')[1],
                }))
            );
        }
    }, [preset]);

    return (
        <div className={s.settings}>
            <div className={classNames(s.setting, s.tuning)}>
                <label htmlFor="tuning-input">Tuning</label>
                <select
                    id="tuning-input"
                    value={preset}
                    onChange={(e) => {
                        setPreset(e.target.value as keyof typeof tuningPresets);
                    }}
                >
                    {Object.keys(tuningPresets).map((preset) => (
                        <option key={preset} value={preset}>
                            {preset}
                        </option>
                    ))}
                </select>
                <div className={s.tuningInputs}>
                    {localTuning.map((note, index) => (
                        <div key={index} className={s.tuningInput}>
                            <label htmlFor={`tuning-input1-${index}`}>{strings[index]}</label>
                            <select
                                id={`tuning-input1-${index}`}
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
                                id={`tuning-input1-${index}`}
                                value={note.number}
                                onChange={(e) =>
                                    handleTuningChange('number', index, e.target.value)
                                }
                                className={`note-select`}
                            >
                                {NUMBERS.map((number) => (
                                    <option key={number} value={number}>
                                        {number}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
            <div className={classNames(s.setting, s.volume)}>
                <label htmlFor={`volume-input`}>Volume</label>
                <div className={s.volumeControl}>
                    <input
                        id={`volume-input`}
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
                <label htmlFor={`volume-input`}>Volume</label>
                <div className={s.volumeControl}>
                    <input
                        id={`volume-input`}
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
                <label htmlFor={`release-input`}>Release</label>
                <div className={s.volumeControl}>
                    <input
                        id={`release-input`}
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
            <div className={classNames(s.setting, s.volume)}>
                <label htmlFor={`guitar-type-input`}>Guitar type</label>
                <div className={s.volumeControl}>
                    <select
                        id="guitar-type-input"
                        value={selectedGuitarObj.id}
                        onChange={(e) => {
                            const selected = guitarObjArray.find((g) => g.id === e.target.value);
                            if (selected) window.location.replace(`/?type=${selected.id}`);
                        }}
                    >
                        {guitarObjArray.map((guitarObj) => (
                            <option key={guitarObj.id} value={guitarObj.id}>
                                {guitarObj.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;
