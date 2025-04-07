export function createSampleMap(instrumentType: string, NOTES: string[]) {
    const sampleMap: Record<string, string> = {};
    
    NOTES.forEach(note => {
      // Преобразуем F# в Fs для имени файла
      const fileName = note.replace('#', 's');
      sampleMap[note] = `${instrumentType}/${fileName}.mp3`;
    });
  
    return sampleMap;
}