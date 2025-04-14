// import { IChord } from '@/types/guitar.types';
import s from './styles.module.scss';
import classNames from 'classnames';
import { useMenu } from './useMenu';
import { Instrument } from '@/modules/instrument/Instrument';
import Chord from './Chord/Chord';

interface IMenuProps {
    instrument: Instrument;
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
                const chordPositions = Array.from({ length: 6 }, (_, i) => i);
                return (<div className={s.chords}>
                    <div onClick={() => startRegistration()} className={classNames(s.chord, s.chord_add, {[s.chord_active]: selectedChordId === -1})}>
                        +
                    </div>
                    {chordPositions.map((position) => {
                        return <Chord
                                    key={position}
                                    chord={activeChords[position]}
                                />
                    })}
                </div>)
            case 'settings':
                return <div>Настройки</div>
        }
    }

    return (
        <div className={s.menu}>
            <div className={s.container}>
                <div className={s.tabs}>
                    <div onClick={() => setPage('settings')}>
                        Настройки
                    </div>
                    <div onClick={() => setPage('chords')}>
                        Аккорды
                    </div>
                    <div onClick={() => setPage('settings')}>
                        Настройки
                    </div>
                    <div onClick={() => setPage('chords')}>
                        Аккорды
                    </div>
                    <div onClick={() => setPage('settings')}>
                        Настройки
                    </div>
                </div>
                <div className={s.page}>
                    {displayPages()}
                </div>
            </div>
        </div>
    );
};

export default MenuComponent