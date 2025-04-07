// import { IChord, IStringNames, IStrings } from "@/types/guitar.types"
// import { generateFrets } from "../../utils/generateFrets"
// import { useEffect, useState } from "react"
// import { now, Player } from "tone"

export const _ = () => {}

// export const useGuitar = () => {
//     const [strings, setStrings] = useState<IStrings>({
//         E1: { frets: generateFrets(["E4", "F4", "Fs4", "G4", "Gs4", "A4", "As4", "B4", "C5", "Cs5", "D5", "Ds5", "E5", "F5", "Fs5", "G5", "Gs5", "A5", "As5", "B5"]) },
//         B: { frets: generateFrets(["B3", "C4", "Cs4", "D4", "Ds4", "E4", "F4", "Fs4", "G4", "Gs4", "A4", "As4", "B4", "C5", "Cs5", "D5", "Ds5", "E5", "F5", "Fs5"]) },
//         G: { frets: generateFrets(["G3", "Gs3", "A3", "As3", "B3", "C4", "Cs4", "D4", "Ds4", "E4", "F4", "Fs4", "G4", "Gs4", "A4", "As4", "B4", "C5", "Cs5", "D5"]) },
//         D: { frets: generateFrets(["D3", "Ds3", "E3", "F3", "Fs3", "G3", "Gs3", "A3", "As3", "B3", "C4", "Cs4", "D4", "Ds4", "E4", "F4", "Fs4", "G4", "Gs4", "A4"]) },
//         A: { frets: generateFrets(["A2", "As2", "B2", "C3", "Cs3", "D3", "Ds3", "E3", "F3", "Fs3", "G3", "Gs3", "A3", "As3", "B3", "C4", "Cs4", "D4", "Ds4", "E4"]) },
//         E2: { frets: generateFrets(["E2", "F2", "Fs2", "G2", "Gs2", "A2", "As2", "B2", "C3", "Cs3", "D3", "Ds3", "E3", "F3", "Fs3", "G3", "Gs3", "A3", "As3", "B3"]) }
//     })
    
//     // Массив сохранённых аккордов
//     const [chords, setChords] = useState<IChord[]>([])
 
//     function pressFret(string: IStringNames, fretId: string, fretIndex: number): void {
//         const play = (note: string) => {
//             const player = new Player({
//                 url: `/samples/guitar-acoustic/${note}.mp3`,
//                 volume: -15,
//                 onload: () => {
//                     player.start(now(), 0, 5);
//                 },
//             }).toDestination();
//         }
//         Object.keys(strings[string].frets).forEach((el) => strings[string].frets[el].isPressed = false)
//         strings[string].frets[`${fretIndex}`].isPressed = true;
//         setStrings(JSON.parse(JSON.stringify(strings)))
//         play(fretId)
//     }

//     function saveChord(key?: number): void {
//         const chord: IChord = {
//             name: '',
//             strings: {
//                 E1: { index: 0, note: '', isPressed: false},
//                 B: { index: 0, note: '', isPressed: false},
//                 G: { index: 0, note: '', isPressed: false},
//                 D: { index: 0, note: '', isPressed: false},
//                 A: { index: 0, note: '', isPressed: false},
//                 E2: { index: 0, note: '', isPressed: false},
//             },
//         };
        
//         // Перебираем все струны
//         for (const stringName in strings) {
//             if (!strings.hasOwnProperty(stringName)) return
//             const string = strings[stringName as keyof IStrings]; // Получаем струну
    
//             // Перебираем все лады на струне
//             for (const fret in string.frets) {
//                 if (!string.frets.hasOwnProperty(fret)) return
//                 const currentFret = string.frets[fret]; // Получаем лад
    
//                 // Если лад зажат, записываем ноту в соответствующий ключ объекта `strings`
//                 if (currentFret.isPressed) {
//                     console.log(currentFret)
//                     chord.strings[stringName as keyof IChord["strings"]] = currentFret;
//                     console.log(JSON.stringify(chord))
//                 }
//             }
//         }

//         if(key !== undefined){
//             chords[key] = chord
//             setChords([...chords])
//             console.log(chords)
//         }else{
//             setChords(prev => [...prev, chord])
//         }

//         // setTimeout(() => {play(chord.strings.E1.note)}, 550)
//         // setTimeout(() => {play(chord.strings.B.note)}, 450)
//         // setTimeout(() => {play(chord.strings.G.note)}, 350)
//         // setTimeout(() => {play(chord.strings.D.note)}, 250)
//         // setTimeout(() => {play(chord.strings.A.note)}, 150)
//         // setTimeout(() => {play(chord.strings.E2.note)}, 50)
//     }

//     useEffect(() => {
//         const selectedNotes = []
//         Object.keys(strings).forEach((stringName) => {
//             const string = strings[stringName as keyof IStrings]; // Получаем струну
          
//             Object.keys(string.frets).forEach((fretKey: string) => {
//               const fret = string.frets[fretKey]; // Получаем лад
          
//               if (fret.isPressed) {
//                 selectedNotes.push({
//                   note: fret.note,
//                   string: stringName,
//                 });
//               }
//             });
//           });
//         if(selectedNotes.length > 1){

//         }
//     }, [strings])

//     return {
//         strings,
//         pressFret,
//         saveChord,
//         chords
//     }
// }