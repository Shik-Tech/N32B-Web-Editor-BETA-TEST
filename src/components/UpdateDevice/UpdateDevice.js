import React, { Fragment, useState } from 'react';
import { generateSysExFromPreset, generateSysExFromPresetV2 } from './utils';
import { forEach, map } from 'lodash';
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
    CircularProgress,
    Dialog,
    DialogTitle,
    Grid,
    IconButton,
    Alert
} from '@mui/material';
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
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
        updateCurrentDevicePresetIndex,
        firmwareVersion
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
        let messages;
        if (firmwareVersion[0] < 30) {
            messages = generateSysExFromPreset(currentPreset);
        } else {
            messages = generateSysExFromPresetV2(currentPreset);
        }
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

    const presets = [0, 1, 2, 3, 4];

    return (
        <>
            <Button
                fullWidth
                variant="contained"
                color="warning"
                endIcon={<DownloadingRoundedIcon />}
                onClick={handleOpen}
            >
                Update
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    <Grid
                        container
                        justifyContent={"space-between"}
                        alignItems="center"
                    >
                        <Typography variant='title'>Update the Device</Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseRoundedIcon />
                        </IconButton>
                    </Grid>
                </DialogTitle>
                <Stack
                    spacing={2}
                    sx={{ m: 2 }}
                >
                    <Typography>
                        Choose which preset slot you wish to save your setup into, then click "UPDATE".
                    </Typography>
                    <Alert
                        severity='warning'
                        variant="filled"
                    >
                        Please set all the knobs before updating the device. <br />
                        This will save the device memory for long term usage.
                    </Alert>
                    <Alert
                        severity='error'
                        variant="filled"
                    >
                        You are about to overwrite Preset {currentDevicePresetIndex + 1}. <br />
                        This operation cannot be reversed!
                    </Alert>

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
                                value={currentDevicePresetIndex}
                                onChange={handlePresetSelect}
                            >
                                {map(presets, (presetValue, key) =>
                                    <MenuItem value={presetValue} key={key}>Preset {presetValue + 1}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            endIcon={<DownloadingRoundedIcon />}
                            onClick={handleSaveToDevice}
                        >
                            Update
                        </Button>
                    </Stack>
                </Stack>
                <UpdateProgress
                    updating={updating}
                    progress={progress}
                />
            </Dialog>
        </>
    );
}

export default UpdateDevice;