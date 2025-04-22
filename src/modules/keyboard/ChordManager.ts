import { IActiveChord, IChord } from "@/types/guitar.types";

export class ChordManager {
    private activeChords: Map<number, IChord> = new Map();
    private currentChord: IActiveChord | null = null;
  
    public registerChord(key: number, chord: IChord) {
      this.activeChords.set(key, chord);
    }
  
    public selectChord(key: number): IActiveChord | null {
      const chord = this.activeChords.get(key);
      if (!chord) {
        this.currentChord = null; // Удаляем текущую аккорд, если он не найден
        return null;
      };
  
      this.currentChord = {
        id: key,
        index: key,
        chord,
        timestamp: Date.now(),
      };
      return this.currentChord;
    }
  
    public getCurrentChord(): IActiveChord | null {
      return this.currentChord;
    }
  
    public getChords(): Record<number, IChord> {
      return Object.fromEntries(this.activeChords.entries());
    }
}