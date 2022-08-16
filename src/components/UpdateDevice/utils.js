import { forEach, map } from 'lodash';
import { SAVE_PRESET, SET_KNOB_MODE, START_SYSEX_MESSAGE } from './commands';

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

export function generateSysExFromPresetV2(currentPreset) {
    const messages = [];
    const {
        knobs
    } = currentPreset;

    const knobMessage = map(knobs, knob => {
        const {
            hardwareId,
            sysExMessage,
            MSBFirst,
            valuesIndex,
            minValue,
            maxValue,
            isSigned
        } = knob;

        return [
            SET_KNOB_MODE,
            hardwareId,
            +MSBFirst,
            valuesIndex,
            minValue >> 4,
            minValue & 0x0F,
            maxValue >> 4,
            maxValue & 0x0F,
            +isSigned,
            START_SYSEX_MESSAGE,
            sysExMessage.length,
            ...map(sysExMessage, byte => parseInt(byte, 16))
        ];
    });

    messages.push(...knobMessage);
    messages.push([SAVE_PRESET, currentPreset.presetID]);

    return messages;
}

// Accepts target obejct of input onChange event
export function validateValueRange({ value, min, max }) {
    return Math.max(Number(min), Math.min(Number(max), Number(value)));
}