import { IFret } from "@/types/guitar.types";

export function generateFrets(notes: string[]): { [note: string]: IFret } {
    const fretsObject: { [note: string]: IFret } = {};
    notes.forEach((note, index) => {
        fretsObject[index] = { index, note: note, isPressed: false };
    });
    Object.keys(fretsObject).map((el, index) => index === 0 ? fretsObject[el].isPressed = true : {})
    return fretsObject;
}