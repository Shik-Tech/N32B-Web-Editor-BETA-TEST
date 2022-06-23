import React from 'react';
import { map } from 'lodash';
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    Grid,
    IconButton
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';

function SyncDEvice(props) {
    const {
        currentDevicePresetIndex,
        updateCurrentDevicePresetIndex,
        handleLoadFromDevice
    } = props;

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handlePresetSelect = e => {
        updateCurrentDevicePresetIndex(parseInt(e.target.value));
    }

    const presets = [0, 1, 2, 3, 4];

    return (
        <>
            <Button
                fullWidth
                variant="contained"
                endIcon={<SyncRoundedIcon />}
                onClick={handleOpen}
            >
                Sync
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
                        <Typography variant='title'>Sync from Device</Typography>
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
                        Select which preset from your device will be synced to the editor:
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
                                {map(presets, (presetValue, key) =>
                                    <MenuItem value={presetValue} key={key}>Preset {presetValue + 1}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            variant="contained"
                            endIcon={<SyncRoundedIcon />}
                            onClick={handleLoadFromDevice}
                        >
                            Sync
                        </Button>
                    </Stack>
                </Stack>
            </Dialog>
        </>
    );
}

export default SyncDEvice;