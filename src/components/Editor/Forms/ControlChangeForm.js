import { Checkbox, Container, FormControl, FormControlLabel, FormGroup, Grid, Input, InputLabel, TextField } from "@mui/material";
import React from "react";
import ChannelSelect from "../Components/ChannelSelect";

function ControlChangeForm({
    currentKnob,
    handleChannelChange,
    handleMSBChange,
    handleInvertAChange
}) {
    const {
        channel,
        msb,
        invert_a
    } = currentKnob;

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <ChannelSelect channel={channel} handleChannelChange={handleChannelChange} />
                </Grid>

                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <TextField
                            label="Control Number"
                            type="number"
                            variant="standard"
                            InputProps={{ inputProps: { min: 0, max: 127 } }}
                            value={msb}
                            onChange={handleMSBChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={2}>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={invert_a}
                                onChange={handleInvertAChange}
                            />
                        }
                        label="Invert" />
                </Grid>
            </Grid>
        </Container>

    )
}

export default ControlChangeForm;