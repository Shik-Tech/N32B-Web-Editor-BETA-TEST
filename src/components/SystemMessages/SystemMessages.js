import React from 'react';
import {
    Button,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    Grid,
    IconButton
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

function SystemMessages(props) {
    const {
        closeDialog,
        message,
        showMessage
    } = props;

    return (
        <Dialog
            open={showMessage}
        >
            <DialogTitle>
                <Grid
                    container
                    justifyContent={"space-between"}
                    alignItems="center"
                >
                    <Typography variant='title'>Notice</Typography>
                    <IconButton
                        onClick={closeDialog}
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
                    {message}
                </Typography>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={closeDialog}
                >
                    Ok
                </Button>
            </Stack>
        </Dialog >
    );
}

export default SystemMessages;