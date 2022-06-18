import React from 'react';
import { generateSysExFromPreset } from './utils';
import { forEach } from 'lodash';
import Popup from 'react-popup';
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography,
    Modal,
    Box
} from '@mui/material';
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// import webmidi from 'webmidi';

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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handlePresetSelect = e => {
        updateCurrentDevicePresetIndex(parseInt(e.target.value));
    }


    const handleSaveToDevice = e => {
        // const messages = isDualMode ?
        // generateSysExFromPreset_MK2(currentPreset) : generateSysExFromPreset(currentPreset);
        const messages = generateSysExFromPreset(currentPreset);
        forEach(messages, message => {
            // console.log(webmidi.outputs[0].sendSysex(32, message));

            console.log(message);
            // midiOutput.sendSysex(32, message);
        });
    }

    // async function showWarning() {
    //     return;
    // }

    const handleLoadFromDevice = e => {
        // midiOutput.sendSysex(124, [7]);
    }



    return (
        <>
            <Button fullWidth
                variant="contained"
                color="warning"
                endIcon={<DownloadingRoundedIcon />}
                onClick={handleOpen}
            >
                Update
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="update-device"
                aria-describedby="update-device-process"
            >
                <Box sx={{ ...style }}>
                    <Stack
                        spacing={2}
                    >
                        <Stack
                            sx={{ p: 1 }}
                            direction="row"
                        >
                            <WarningAmberRoundedIcon fontSize="large" color="warning" />
                            <Typography variant="body2" sx={{ color: '#ffa726', p: 1 }}>
                                Please set all the knobs before updating the device.
                            </Typography>
                        </Stack>

                        <Typography>
                            Choose which preset slot you wish to save your setup to. Click "UPDATE" when done.
                        </Typography>

                        <Stack
                            sx={{ border: '1px solid #f44336', borderRadius: 1, p: 1 }}
                            direction="row"
                        >
                            <WarningAmberRoundedIcon fontSize="large" color="error" />
                            <Typography sx={{ color: '#f44336', p: 1 }}>
                                You are about to overwrite Preset {currentPreset.presetID}.<br />
                                This cannot be reversed!
                            </Typography>
                        </Stack>

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
                                color="error"
                                endIcon={<DownloadingRoundedIcon />}
                                onClick={handleSaveToDevice}
                            >
                                Update
                            </Button>

                            <Button fullWidth
                                variant="contained"
                                // color="error"
                                endIcon={<CloseRoundedIcon />}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}

export default PresetOperations;