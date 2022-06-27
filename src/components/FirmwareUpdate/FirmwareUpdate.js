import React, { useRef, useState } from 'react';
import { Button, Dialog, DialogTitle, FormControl, Grid, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { map } from 'lodash';
import * as Avrgirl from 'avrgirl-arduino';
import { Buffer } from 'buffer';


function FirmwareUpdate() {
    const [open, setOpen] = React.useState(false);
    const fileInput = useRef(null);
    const [fileName, updateFileName] = useState("");
    const [filePath, updateFilePath] = useState("");
    const [uploading, updateUploading] = useState(false);
    const [errorMessage, updateErrorMessage] = useState(false);
    const [doneUploading, updateDoneUploading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFirmwareUpdate = async (event) => {
        updateUploading(true);
        updateErrorMessage(false);
        updateDoneUploading(false);

        Avrgirl.list(function (err, ports) {
            console.log(ports);
        });

        const avrgirl = new Avrgirl({
            board: {
                name: 'leonardo',
                baud: 57600,
                signature: Buffer.from([0x43, 0x41, 0x54, 0x45, 0x52, 0x49, 0x4e]),
                productId: ['0x0036', '0x0037', '0x8036', '0x800c', '0x614f'],
                productPage: 'https://store.arduino.cc/leonardo',
                protocol: 'avr109'
            }
        });


        avrgirl.flash(filePath, (error) => {
            if (error) {
                console.error(error);
                updateErrorMessage(true);
            } else {
                updateDoneUploading(true);
            }
            updateUploading(false);
        });
    }

    return (
        <>
            <Button
                fullWidth
                variant="contained"
                color="error"
                // endIcon={<SyncRoundedIcon />}
                onClick={handleOpen}
            >
                Firmware Update
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
                        <Typography variant='title'>Firmware Update</Typography>
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
                        Update your N32B midi controller to the latest firmware.
                    </Typography>

                    <Input
                        type="file"
                        inputRef={fileInput}
                        inputProps={{ accept: ".hex" }}
                        onChange={() => {
                            if (fileInput.current.files.length > 0) {
                                updateFileName(fileInput.current.files[0].name);
                                updateFilePath(fileInput.current.files[0].path);
                            }
                        }}
                    />


                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        {/* <FormControl fullWidth>
                            <InputLabel id="preset-select-label">N32B Preset</InputLabel>
                            <Select
                                labelId="preset-select-label"
                                id="preset-select"
                                label="Device Preset"
                                color='warning'
                            // value={}
                            // onChange={}
                            >
                                {map([], (presetValue, key) =>
                                    <MenuItem value={presetValue} key={key}>Preset {presetValue + 1}</MenuItem>
                                )}
                            </Select>
                        </FormControl> */}

                        <Button
                            fullWidth
                            variant="contained"
                            // endIcon={<SyncRoundedIcon />}
                            onClick={handleFirmwareUpdate}
                        >
                            Update
                        </Button>
                    </Stack>
                </Stack>
            </Dialog>
        </>
    )
}

export default FirmwareUpdate;