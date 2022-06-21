const SET_KNOB_MODE = 1;       // Define knob mode (see KNOB_MODES)
const SAVE_PRESET = 2;         // Save the preset
const LOAD_PRESET = 3;         // Load a preset
const SEND_CURRENT_CONFIG = 4; // Send the current config
const SYNC_KNOBS = 5;          // Forces the emission of the messages associated to every knob
const CHANGE_CHANNEL = 6;      // Changes the global MIDI channel

export { SET_KNOB_MODE, SAVE_PRESET, LOAD_PRESET, SEND_CURRENT_CONFIG, SYNC_KNOBS, CHANGE_CHANNEL };