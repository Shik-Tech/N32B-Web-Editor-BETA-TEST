import React, { Fragment, useState } from 'react';
import { generateSysExFromPreset } from './utils';
import { forEach } from 'lodash';
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography,
    Modal,
    Box,
    CircularProgress
} from '@mui/material';
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

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

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}


function UpdateProgress({ updating, progress }) {
    return (
        <Fragment>
            <Modal
                // hideBackdrop
                open={updating}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <Stack
                        direction="row"
                        spacing={3}
                    >
                        <Typography variant='h6'>Updating</Typography>
                        <CircularProgressWithLabel value={progress} />
                    </Stack>
                </Box>
            </Modal>
        </Fragment>
    );
}

function UpdateDevice(props) {
    const {
        currentPreset,
        midiOutput,
        currentDevicePresetIndex,
        updateCurrentDevicePresetIndex
    } = props;

    const [open, setOpen] = React.useState(false);
    const [updating, setUpdating] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handlePresetSelect = e => {
        updateCurrentDevicePresetIndex(parseInt(e.target.value));
    }

    const handleSaveToDevice = e => {
        setUpdating(true);
        let promise = Promise.resolve();
        const messages = generateSysExFromPreset(currentPreset);
        forEach(messages, (message, key) => {
            promise = promise.then(() => {
                setProgress((key + 1) * 100 / messages.length);
                midiOutput.sendSysex(32, message);

                return new Promise(resolve => {
                    setTimeout(resolve, 50);
                });
            });
        });
        promise.then(() => {
            setUpdating(false);
            setOpen(false);
            setProgress(0);
        });
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
                            Choose which preset slot you wish to save your setup into, then click "UPDATE".
                        </Typography>

                        <Stack
                            sx={{ border: '1px solid #f44336', borderRadius: 1, p: 1 }}
                            direction="row"
                        >
                            <WarningAmberRoundedIcon fontSize="large" color="error" />
                            <Typography sx={{ color: '#f44336', p: 1 }}>
                                You are about to overwrite Preset {currentPreset.presetID}.<br />
                                This  operation cannot be reversed!
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
                    <UpdateProgress
                        updating={updating}
                        progress={progress}
                    />
                </Box>
            </Modal>
        </>
    );
}

export default UpdateDevice;