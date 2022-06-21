import { forEach } from 'lodash';
import { SAVE_PRESET, SET_KNOB_MODE } from './commands';

export function generateSysExFromPreset(currentPreset) {
    const messages = [];
    const {
        knobs
    } = currentPreset;

    forEach(knobs, (knob) => {
        const {
            hardwareId,
            mode,
            msb,
            lsb,
            channel,
            invert_a,
            invert_b
        } = knob;

        const knobMessage = [
            SET_KNOB_MODE,
            hardwareId,
            msb,
            lsb,
            channel,
            mode,
            +invert_a,
            +invert_b
        ];

        messages.push(knobMessage);
    });

    messages.push([SAVE_PRESET, currentPreset.presetID]);

    return messages;
}

// Accepts target obejct of input onChange event
export function validateValueRange({ value, min, max }) {
    return Math.max(Number(min), Math.min(Number(max), Number(value)));
}