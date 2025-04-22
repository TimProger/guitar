import { IFret, IStringNames } from '../../types/guitar.types';
import { InstrumentController } from './InstrumentController';

export type IStrings = Record<IStringNames, { frets: Record<string, IFret> }>;

export class InstrumentUtilities {
    private instrumentController: InstrumentController;

    constructor(instrumentController: InstrumentController) {
        this.instrumentController = instrumentController;
    }

    public setVolume(level: number) {
        this.instrumentController.getAudioEngine().setVolume(level);
    }
}
