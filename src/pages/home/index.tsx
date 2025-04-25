import React, { useEffect, useState } from 'react';
import { IStrings } from '@/types/guitar.types';
import { InstrumentController } from '../../modules/instrument/InstrumentController';
import StringComponent from './parts/StringComponent';
import s from './styles.module.scss';
import MenuComponent from './parts/MenuComponent';
// import { $api } from "../../http/axios";
// import { Storage } from "../../utils/storage";

interface IHomeProps {}

const instrument = new InstrumentController(); // Один на всё приложение

const Home: React.FC<IHomeProps> = ({}) => {
    const [stringsData, setStringsData] = useState<IStrings>([]);

    const pressFret = (stringIndex: number, noteIndex: number) => {
        instrument.pressFret(stringIndex, noteIndex);
    };

    useEffect(() => {
        if (instrument) {
            setStringsData(instrument.getStringManager().getStringsData());
        }
    }, []);

    // const buttonHandler = () => {
    //   $api.post('/auth/register', {
    //     email: "7b2332atdatima@mail.ru",
    //     username: "crumbl",
    //     password: "qwerty123",
    //     role: "user"
    //   }).then(res => {
    //     Storage.set('accessToken', res.data.access_token);
    //     console.log(res.data);
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // }

    return (
        <div className={s.main}>
            <div className={s.guitar}>
                <div className={s.container}></div>
                <img src="/images/guitar.png" alt="guitar_img" draggable="false" />
                <div className={s.strings}>
                    {!!stringsData.length &&
                        stringsData.map((stringObj, index) => {
                            // console.log(
                            //     'stringObj',
                            //     stringObj.name,
                            //     stringObj.frets[0].note,
                            //     index
                            // );
                            return (
                                <StringComponent
                                    key={stringObj.name}
                                    frets={stringObj.frets}
                                    pressFret={pressFret}
                                    index={index}
                                />
                            );
                        })}
                    {/* <button onClick={buttonHandler} >кликнsss22223</button> */}
                </div>
            </div>
            <div className={s.menu}>
                <MenuComponent setStringsData={setStringsData} instrument={instrument} />
            </div>
        </div>
    );
};

export default Home;
