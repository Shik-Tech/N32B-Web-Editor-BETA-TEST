import React from 'react';
import { Grid, Typography } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

function ConnectDevice() {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: 'calc(100vh - 48px)', textAlign: 'center' }}
        >
            <Grid item>
                <WarningAmberRoundedIcon color="warning" fontSize="large" />
            </Grid>
            <Grid item>
                <Typography>Please connect the N32B to your computer with a data usb cable</Typography>
                <Typography variant='body2'>
                    Make sure you connect only one N32B device while using the editor
                </Typography>
            </Grid>
        </Grid>
    )
}

export default ConnectDevice;
