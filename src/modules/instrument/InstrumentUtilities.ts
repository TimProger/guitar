import { InstrumentController } from './InstrumentController';

export class InstrumentUtilities {
    private instrumentController: InstrumentController;

    constructor(instrumentController: InstrumentController) {
        this.instrumentController = instrumentController;
    }

    public setVolume(level: number) {
        this.instrumentController.getAudioEngine().setVolume(level);
    }
}
