import { IFret } from "@/types/guitar.types";

export function generateFrets(notes: string[]): { [note: string]: IFret } {
    const fretsObject: { [note: string]: IFret } = {};
    notes.forEach((note, index) => {
        fretsObject[index] = { index, note: note, isPressed: false };
    });
    Object.keys(fretsObject).map((el, index) => index === 0 ? fretsObject[el].isPressed = true : {})
    return fretsObject;
}

export function generateNoteSequence(startNote: string, count: number): string[] {

    const ALL_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    
    // Парсим начальную ноту (пример: "D3" → ["D", "3"])
    const [, noteName, octaveStr] = startNote.match(/^([A-G]#?)(\d+)$/) || [];
    if (!noteName || !octaveStr) throw new Error(`Invalid note: ${startNote}`);
    
    let octave = parseInt(octaveStr);
    const result: string[] = [];
    let currentNoteIndex = ALL_NOTES.indexOf(noteName);
    
    if (currentNoteIndex === -1) throw new Error(`Note ${noteName} not found`);
    
    for (let i = 0; i < count; i++) {
        // Добавляем ноту с текущей октавой
        result.push(`${ALL_NOTES[currentNoteIndex]}${octave}`);
        
        // Переход к следующей ноте
        currentNoteIndex++;
        
        // Если дошли до конца списка нот, переходим на новую октаву
        if (currentNoteIndex >= ALL_NOTES.length) {
            currentNoteIndex = 0;
            octave++;
        }
    }
    
    return result;
}