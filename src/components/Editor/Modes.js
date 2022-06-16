const KNOB_MODE_DISABLE = 0;
const KNOB_MODE_STANDARD = 1;
const KNOB_MODE_DUAL = 2;
const KNOB_MODE_NRPN = 3;
const KNOB_MODE_RPN = 4;
const KNOB_MODE_HIRES = 5;

const ModeIndexes = {
    KNOB_MODE_DISABLE,
    KNOB_MODE_STANDARD,
    KNOB_MODE_DUAL,
    KNOB_MODE_NRPN,
    KNOB_MODE_RPN,
    KNOB_MODE_HIRES
};

const Modes = [
    { name: "Disabled", value: KNOB_MODE_DISABLE },
    { name: "Control Change", value: KNOB_MODE_STANDARD },
    { name: "High Resolution Control Change", value: KNOB_MODE_HIRES },
    { name: "Dual Control Change", value: KNOB_MODE_DUAL },
    { name: "RPN", value: KNOB_MODE_RPN },
    { name: "NRPN", value: KNOB_MODE_NRPN },
];

export { Modes, ModeIndexes };