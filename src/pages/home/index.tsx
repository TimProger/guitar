import React, { useCallback, useMemo, useState } from "react";
import { IStringNames } from "@/types/guitar.types";
// import { useKeyboard } from "@/hooks/useKeyboard";
import { GuitarInstrument } from "../../modules/Instrument";
import StringComponent from "./parts/StringComponent";
import s from './styles.module.scss';
import MenuComponent from "./parts/MenuComponent";

interface IHomeProps {
}

// const instrument = new GuitarInstrument();

const Home: React.FC<IHomeProps> = ({}) => {

  const instrument = useMemo(() => new GuitarInstrument(), []);
  const forceUpdate = useForceUpdate();

  const pressFret = (stringName: IStringNames, _note: string, noteIndex: number) => {
    instrument.pressFret(stringName, noteIndex);
    forceUpdate(); // Обновляем UI
  };

  const stringsData = instrument.getStringsData();

  return (
    <div className={s.guitar}>
      {Object.keys(stringsData).map((stringName) => (
        <StringComponent
          key={stringName}
          name={stringName as IStringNames}
          frets={stringsData[stringName as IStringNames].frets}
          pressFret={pressFret}
        />
      ))}
      <MenuComponent instrument={instrument} />
    </div>
  )
}

export function useForceUpdate() {
  const [, setValue] = useState(0);
  return useCallback(() => setValue(v => v + 1), []);
}

export default Home