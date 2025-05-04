const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const chordTypeTable: Record<string, string> = {
    '4,7': '',
    '3,7': 'm',
    '3,7,10': 'm7',
    '4,7,11': 'maj7',
    '4,7,9': '6',
};

function getNoteIndex(note: string): number {
    return NOTES.indexOf(note);
}

export function getChordType(candidateChord: string[]): Record<string, string | null> | string {
    if (candidateChord.length < 2) {
        return 'Unknown';
    }

    // Remove duplicate notes
    const uniqueChord = Array.from(new Set(candidateChord));
    const result: Record<string, string | null> = {};

    for (const referenceNote of uniqueChord) {
        const intervals: number[] = [];

        for (const note of uniqueChord) {
            if (note !== referenceNote) {
                const interval = (getNoteIndex(note) - getNoteIndex(referenceNote) + 12) % 12;
                intervals.push(interval);
            }
        }

        const numIntervals = uniqueChord.length - 1;

        // Filter only chord types matching the interval count
        const matchingChordTypes = Object.keys(chordTypeTable).filter(
            (key) => key.split(',').length === numIntervals
        );

        for (const chordKey of matchingChordTypes) {
            const targetIntervals = chordKey.split(',').map(Number);
            const subsetSize = targetIntervals.length;

            const combinations = getCombinations(intervals, subsetSize);
            for (const subset of combinations) {
                const sortedSubset = subset.slice().sort((a, b) => a - b);
                const key = sortedSubset.join(',');

                if (chordTypeTable[key]) {
                    result[key] = `${referenceNote} ${chordTypeTable[key]}`;
                } else {
                    result[key] = null;
                }
            }
        }
    }

    return result;
}

// Helper function for combinations
function getCombinations<T>(array: T[], size: number): T[][] {
    if (size > array.length) return [];

    const result: T[][] = [];
    const recurse = (start: number, combo: T[]) => {
        if (combo.length === size) {
            result.push(combo);
            return;
        }
        for (let i = start; i < array.length; i++) {
            recurse(i + 1, [...combo, array[i]]);
        }
    };
    recurse(0, []);
    return result;
}
