import React, { useRef } from 'react';
import { generateSysExFromPreset } from './utils';
import { forEach } from 'lodash';
import Popup from 'react-popup';
import {
    Divider,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography
} from '@mui/material';
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';

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

    const handlePresetSelect = e => {
        updateCurrentDevicePresetIndex(parseInt(e.target.value));
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
            <Typography>
                <PriorityHighRoundedIcon sx={{ fontSize: 30, mb: -1 }} color="warning" />
                After setting all the knobs, please choose the preset slot you wish to save this setup on, than click "Update".
            </Typography>

            <Stack
                direction="row"
                spacing={2}
            >
                <FormControl fullWidth>
                    <InputLabel id="preset-select-label">N32B Preset</InputLabel>
                    <Select
                        labelId="preset-select-label"
                        id="preset-select"
                        label="Device Preset"
                        color='warning'
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

                <Button fullWidth
                    variant="contained"
                    color="warning"
                    endIcon={<DownloadingRoundedIcon />}
                    onClick={handleSaveToDevice}
                >
                    Update
                </Button>
            </Stack>
        </Stack>
    );
}

export default PresetOperations;