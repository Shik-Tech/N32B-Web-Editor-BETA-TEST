import React, { useRef } from 'react';
import { generateSysExFromPreset, generateSysExFromPreset_MK2 } from './utils';
import { forEach } from 'lodash';
import Popup from 'react-popup';
import { Divider, Button, Container, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
// import webmidi from 'webmidi';

// const { dialog } = window.electron;
const jetpack = window.jetpack;

function PresetOperations(props) {
    const {
        // isDualMode,
        currentPreset,
        // midiInput,
        // midiOutput,
        handleLoadNewPreset,
        currentDevicePresetIndex,
        updateCurrentDevicePresetIndex
    } = props;
    const fileInput = useRef(null);

    const handlePresetSelect = e => {
        updateCurrentDevicePresetIndex(parseInt(e.target.value));
    }

    const handleLoadPreset = e => {
        const reader = new FileReader();
        if (fileInput.current.files.length > 0) {
            const file = fileInput.current.files[0];
            // updatePresetName(file.name);
            reader.onload = (event => {
                const preset = JSON.parse(event.target.result);
                handleLoadNewPreset(preset);
                updateCurrentDevicePresetIndex(0);
            });
            reader.readAsText(file);
        }
    }

    const handleSavePreset = e => {
        // const presetFilePath = dialog.showSaveDialogSync({
        //     title: 'Save Preset',
        //     buttonLabel: 'Save Preset'
        // });
        // if (presetFilePath) {
        //     try {
        //         jetpack.write(presetFilePath, currentPreset);
        //     }
        //     catch (err) {
        //         console.log('error: ', err);
        //     }
        // }
    }

    const handleSaveToDevice = e => {
        const action = function () {
            // const messages = isDualMode ?
            // generateSysExFromPreset_MK2(currentPreset) : generateSysExFromPreset(currentPreset);
            const messages = generateSysExFromPreset(currentPreset);
            forEach(messages, message => {
                // console.log(webmidi.outputs[0].sendSysex(32, message));

                console.log(message);
                // midiOutput.sendSysex(32, message);
            });
            Popup.close();
        };

        Popup.create({
            title: 'Write to device',
            content: `You are about to overwrite "Preset ${currentPreset.presetID}".`,
            buttons: {
                left: [{
                    text: 'Cancel',
                    className: 'danger',
                    action: function () {
                        Popup.close();
                    }
                }],
                right: [{
                    text: 'Write to Device',
                    className: 'success',
                    action
                }]
            }
        });

    }

    // async function showWarning() {
    //     return;
    // }

    const handleLoadFromDevice = e => {
        // midiOutput.sendSysex(124, [7]);
    }

    return (
        <Stack
            spacing={2}
        >
            <Stack
                direction="row"
                spacing={2}
            >
                <Button
                    variant="outlined"
                    onClick={() => fileInput.current.click()}
                >
                    Load Preset<br />
                    to the editor
                </Button>
                <input
                    className="hiddenField"
                    type="file"
                    ref={fileInput}
                    onChange={handleLoadPreset}
                />
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleSavePreset}
                >
                    Save Preset<br />
                    to your computer
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleLoadFromDevice}
                >
                    Load from Device
                </Button>
            </Stack>

            <Divider />

            <Stack
                direction="row"
                spacing={2}
            >
                <FormControl size="small">
                    <InputLabel id="preset-select-label">Device Preset</InputLabel>
                    <Select
                        labelId="preset-select-label"
                        id="preset-select"
                        label="Device Preset"

                        value={currentDevicePresetIndex}
                        onChange={handlePresetSelect}
                    >
                        <MenuItem value={0}>Preset 0</MenuItem>
                        <MenuItem value={1}>Preset 1</MenuItem>
                        <MenuItem value={2}>Preset 2</MenuItem>
                        <MenuItem value={3}>Preset 3</MenuItem>
                        <MenuItem value={4}>Preset 4</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    onClick={handleSaveToDevice}
                >
                    Write to Device
                </Button>
            </Stack>
        </Stack>
    );
}

export default PresetOperations;