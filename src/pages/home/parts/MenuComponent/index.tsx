// import { IChord } from '@/types/guitar.types';
import s from './styles.module.scss';
import classNames from 'classnames';
import { useMenu } from './useMenu';
import { GuitarInstrument } from '@/modules/Instrument';

interface IMenuProps {
    instrument: GuitarInstrument;
}

const MenuComponent: React.FC<IMenuProps> = ({ instrument }) => {

    const {
        page,
        setPage,
        activeChords,
        selectedChordId,
        startRegistration
    } = useMenu({instrument})

    const displayPages = () => {
        switch(page){
            case 'chords':
                return (<div className={s.chords}>
                    <div onClick={() => startRegistration()} className={classNames(s.chord, s.chord_add, {[s.chord_active]: selectedChordId === -1})}>
                        +
                    </div>
                    {Object.entries(activeChords).map(([key, chord]) => {
                        return chord && chord.strings
                            ? <div key={key} className={classNames(s.chord)}>
                                <p>{chord.strings.E1.note} {chord.strings.E1.index}</p>
                                <p>{chord.strings.B.note} {chord.strings.B.index}</p>
                                <p>{chord.strings.G.note} {chord.strings.G.index}</p>
                                <p>{chord.strings.D.note} {chord.strings.D.index}</p>
                                <p>{chord.strings.A.note} {chord.strings.A.index}</p>
                                <p>{chord.strings.E2.note} {chord.strings.E2.index}</p>
                            </div>
                            : <div key={key} className={s.chord}></div>
                    })}
                    {Object.entries(activeChords).length < 6 && new Array(6-Object.entries(activeChords).length).fill(null).map(_ => <div className={s.chord}></div>)}
                </div>)
            case 'settings':
                return <div>Настройки</div>
        }
    }

    return (
        <div className={s.menu}>
            <div className={s.tabs}>
                <div onClick={() => setPage('chords')}>
                    Аккорды
                </div>
                <div onClick={() => setPage('settings')}>
                    Настройки
                </div>
            </div>
            {displayPages()}
        </div>
    );
};

export default MenuComponent