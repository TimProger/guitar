import React, { useEffect, useState } from 'react';
import s from './styles.module.scss';
import { IChord } from '@/types/guitar.types';
import classNames from 'classnames';

interface ChordDiagramProps {
  selectedChordId: number | null;
  position: number;
  chord: IChord;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ position, selectedChordId, chord }) => {

  const [minFret, setMinFret] = useState<number>(0);
  

  const stringsOrder: (keyof IChord['strings'])[] = ['E1', 'B', 'G', 'D', 'A', 'E2'];


  // Функция для вычисления минимального зажатого лада
  const calculateMinFret = (chord: IChord): number => {
    const fretValues = Object.values(chord.strings)
      .filter(string => string.index > 0)
      .map(string => string.index);

    return fretValues.length > 0 ? Math.min(...fretValues) : 0;
  };

  // Обновляем minFret при изменении аккорда
  useEffect(() => {
    if(chord){
      setMinFret(calculateMinFret(chord));
    }
  }, [chord]);

  if(!chord) return <div className={s.chord}></div>; // Если аккорд не передан, ничего не отображаем

  return (
    <div className={classNames(s.chord, {[s.chord_active]: position === selectedChordId})}>
      <div className={s.fretboard}>
        <div className={s['fret-number']}></div>
        
        {[1, 2, 3, 4].map(fretNum => (
          <div key={`fret-${fretNum}`} className={s['fret-label']}>
            {minFret > 0 ? minFret + fretNum - 1 : fretNum}
          </div>
        ))}

        {stringsOrder.map(stringName => {
          const { index } = chord.strings[stringName];
          const adjustedIndex = index - minFret + 1;
          const showMarker = index > 0 && adjustedIndex <= 6;
          
          return (
            <React.Fragment key={stringName}>
              <div className={s['string-name']}>
                {stringName === 'E2' ? 'E' : stringName === 'E1' ? 'e' : stringName}
              </div>

              {[1, 2, 3, 4].map(fretNum => (
                <div
                  key={`${stringName}-${fretNum}`}
                  className={`
                    ${s.fret} 
                    ${showMarker && adjustedIndex === fretNum ? s.active : ''}
                    ${fretNum === 1 && index === -1 && s.closed}
                    ${fretNum === 1 && index === 0 && s.open}
                    ${fretNum === 4 && index > minFret+3 && s.last}
                  `}
                  data-fret={fretNum === 4 && index > minFret+3 ? index : ''}
                />
              ))}
            </React.Fragment>
          );
        })}
      </div>
      <div className={s['chord-name']}>{chord.name}</div>
  </div>
  );
};

export default ChordDiagram;