import React, { useEffect, useMemo, useState } from "react";
import { IStringNames } from "@/types/guitar.types";
import { Instrument, IStrings } from "../../modules/instrument/Instrument";
import StringComponent from "./parts/StringComponent";
import s from './styles.module.scss';
import MenuComponent from "./parts/MenuComponent";

interface IHomeProps {
}

const Home: React.FC<IHomeProps> = ({}) => {

  const instrument = useMemo(() => new Instrument(), []);
  const [stringsData, setStringsData] = useState<IStrings | null>(null)

  const pressFret = (stringName: IStringNames, _note: string, noteIndex: number) => {
    instrument.pressFret(stringName, noteIndex);
    // forceUpdate({});
  };

  useEffect(() => {
    if(instrument){
      setStringsData(instrument.getStringsData())
    }
  }, [instrument]);

  return (
    <div className={s.main}>
      <div className={s.guitar}>
        <div className={s.container}></div>
        <img src="/images/guitar.png" alt="guitar_img" />
        <div className={s.strings}>
          {stringsData && Object.keys(stringsData).map((stringName, index) => (
            <StringComponent
              key={stringName}
              name={stringName as IStringNames}
              frets={stringsData[stringName as IStringNames].frets}
              pressFret={pressFret}
              index={index}
            />
          ))}
        </div>
      </div>
      <div className={s.menu}>
        <MenuComponent setStringsData={setStringsData} instrument={instrument} />
      </div>
    </div>
  )
}


export default Home