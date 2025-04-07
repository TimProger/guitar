import { GuitarInstrument } from "@/modules/Instrument";
// import classNames from "classnames";
// import s from './styles.module.scss';
// import StringComponent from "../StringComponent";
// import { IStrings } from "@/types/guitar.types";

interface GuitarStringsProps {
    instrument: GuitarInstrument;
    onFretClick: (stringName: string, fretIndex: number) => void;
}

export const GuitarStrings = ({ }: GuitarStringsProps) => {
    // const stringsState = instrument.getAllStringsState();
    // console.log(1, stringsState, Object.keys(stringsState), stringsState['A'])

    return (
        <div className="guitar-strings">
        {/* {Object.entries(stringsState).map(([stringName, frets]) => (
          <div key={stringName} className={s.string}>
            {frets.map((fret) => (
                <div
                    key={`${stringName}-${fret.index}`}
                    className={classNames(s.fret, {[s.fret_pressed]: fret.isPressed})}
                    onClick={() => onFretClick(stringName, fret.index)}
                >
                    {fret.note}
                </div>
            ))}
          </div>
        ))} */}
        {/* {Object.keys(stringsState).map((stringName) => (
            <StringComponent
                key={stringName}
                name={stringName as keyof IStrings}
                frets={stringsState[stringName as keyof IStrings].frets}
                pressFret={onFretClick}
            />
        ))} */}
      </div>
    );
};