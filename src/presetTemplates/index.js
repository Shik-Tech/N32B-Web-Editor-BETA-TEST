import singleMode from './dualMode/default.json';
import dualMode from './dualMode/defaultDual.json';
import invertedDualMode1 from './dualMode/invertedDual1.json';
import invertedDualMode2 from './dualMode/invertedDual2.json';
import defaults from './default/default.json';
import highRes from './highRes/default.json';

const dualModePresets = [singleMode, dualMode, invertedDualMode1, invertedDualMode2];
const highResPresets = [highRes];
const defaultsPresets = [defaults];

export { dualModePresets, highResPresets, defaultsPresets };