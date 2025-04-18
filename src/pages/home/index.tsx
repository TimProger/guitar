import React, { useEffect, useState } from "react";
import { IStringNames } from "@/types/guitar.types";
import { Instrument, IStrings } from "../../modules/instrument/Instrument";
import StringComponent from "./parts/StringComponent";
import s from './styles.module.scss';
import MenuComponent from "./parts/MenuComponent";
import { $api } from "../../http/axios";
import { Storage } from "../../utils/storage";

interface IHomeProps {
}

const instrument = new Instrument(); // Один на всё приложение

const Home: React.FC<IHomeProps> = ({}) => {

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

  const buttonHandler = () => {
    $api.post('/auth/register', {
      email: "7b2332atdatima@mail.ru",
      username: "crumbl",
      password: "qwerty123",
      role: "user"
    }).then(res => {
      Storage.set('accessToken', res.data.access_token);
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div className={s.main}>
      <div className={s.guitar}>
        <div className={s.container}></div>
        <img src="/images/guitar.png" alt="guitar_img" draggable="false" />
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
          <button onClick={buttonHandler} >кликнsss2222</button>
        </div>
      </div>
      <div className={s.menu}>
        <MenuComponent setStringsData={setStringsData} instrument={instrument} />
      </div>
    </div>
  )
}


export default Home