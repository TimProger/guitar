const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const chordTypeTable: Record<string, string> = {
    '4,7': 'MAJ',
    '3,7': 'MIN',
    '3,7,10': 'MIN7',
    '4,7,11': 'MAJ7',
};

type ChordResult = Record<string, string | null>;

export function getChordType(candidateChord: string[]): ChordResult {
    if (candidateChord.length < 2) {
        return { Unknown: null };
    }

    // Удаляем дубликаты нот
    const uniqueChord = [...new Set(candidateChord)];
    if (uniqueChord.length !== candidateChord.length) {
        candidateChord = uniqueChord;
    }

    const result: ChordResult = {};

    for (const referenceNote of candidateChord) {
        const intervals: number[] = [];
        for (const note of candidateChord) {
            if (note !== referenceNote) {
                const interval = (NOTES.indexOf(note) - NOTES.indexOf(referenceNote)) % 12;
                intervals.push(interval);
            }
        }

        // Фильтруем типы аккордов по количеству интервалов
        const numIntervals = candidateChord.length - 1;
        for (const chordIntervalsStr of Object.keys(chordTypeTable)) {
            const chordIntervals = chordIntervalsStr.split(',').map(Number);
            if (chordIntervals.length === numIntervals) {
                console.log(
                    `Checking chord intervals: ${chordIntervals}, Subset size: ${chordIntervals.length}`
                );

                // Генерируем все комбинации интервалов
                const subsets = getCombinations(intervals, chordIntervals.length);

                for (const subset of subsets) {
                    const subsetKey = subset.sort((a, b) => a - b).join(',');
                    if (chordTypeTable[subsetKey]) {
                        result[subsetKey] = `${referenceNote} ${chordTypeTable[subsetKey]}`;
                    } else {
                        result[subsetKey] = null;
                    }
                }
            }
        }
    }

    console.log('Chord result:', result);
    return result;
}

// Вспомогательная функция для генерации комбинаций
function getCombinations(arr: number[], k: number): number[][] {
    const result: number[][] = [];

    function backtrack(start: number, current: number[]) {
        if (current.length === k) {
            result.push([...current]);
            return;
        }

        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }

    backtrack(0, []);
    return result;
}
