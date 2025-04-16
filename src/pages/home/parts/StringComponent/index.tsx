import classNames from "classnames";
import s from './styles.module.scss';
import { IFret, IStrings } from "@/types/guitar.types";

// Типизация пропсов для компонента String
interface StringProps {
    name: keyof IStrings;
    frets: { [note: string]: IFret };
    pressFret: (stringName: keyof IStrings, fretId: string, noteIndex: number) => void;
}

// Компонент для отображения струны
const StringComponent: React.FC<StringProps> = ({ name, frets, pressFret }) => {
    return (
    <div className={s.string}>
        <div className={s.name}>{name === 'E2' ? 'E' : name === 'E1' ? 'e' : name}</div>
        <div className={s.frets}>
            {Object.keys(frets).map((fretId, noteIndex) => (
                <div
                    key={fretId}
                    className={classNames(s.fret, {[s.fret_pressed]: frets[fretId].isPressed})}
                    onClick={() => pressFret(name, frets[fretId].note, noteIndex)}
                >
                    {frets[fretId].note}
                </div>
            ))}
        </div>
    </div>
    );
};

export default StringComponent