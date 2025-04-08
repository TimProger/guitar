import { IFret } from "@/types/guitar.types";

const ALL_NOTES = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

export function generateFrets(notes: string[]): { [note: string]: IFret } {
    const fretsObject: { [note: string]: IFret } = {};
    notes.forEach((note, index) => {
        fretsObject[index] = { index, note: note, isPressed: false };
    });
    Object.keys(fretsObject).map((el, index) => index === 0 ? fretsObject[el].isPressed = true : {})
    return fretsObject;
}

export function generateNoteSequence(startNote: string, count: number): string[] {
    // Разбиваем ноту на букву и октаву (например, "E2" => ["E", 2])
    const [, noteName, octaveStr] = startNote.match(/^([A-G]#?)(\d+)$/) || [];
    if (!noteName || !octaveStr) {
        throw new Error(`Invalid note format: ${startNote}`);
    }
    
    let octave = parseInt(octaveStr, 10);
    const result: string[] = [];
    let currentNoteIndex = ALL_NOTES.indexOf(noteName);
    
    if (currentNoteIndex === -1) {
        throw new Error(`Note ${noteName} not found in the scale`);
    }
    
    for (let i = 0; i < count; i++) {
        // Добавляем ноту с текущей октавой
        result.push(`${ALL_NOTES[currentNoteIndex]}${octave}`);
        
        // Переходим к следующей ноте (с переходом на новую октаву)
        currentNoteIndex++;
        if (currentNoteIndex >= ALL_NOTES.length) {
            currentNoteIndex = 0;
            octave++;
        }
    }
    
    return result;
}