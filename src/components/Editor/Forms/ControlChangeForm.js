import { Checkbox, Container, Divider, FormControl, FormControlLabel, FormGroup, Grid, Input, InputLabel, Stack, TextField } from "@mui/material";
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
        <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
        >
            <ChannelSelect channel={channel} handleChannelChange={handleChannelChange} />

            <FormControl fullWidth>
                <TextField
                    label="Control Number"
                    type="number"

                    InputProps={{ inputProps: { min: 0, max: 127 } }}
                    value={msb}
                    onChange={handleMSBChange}
                />
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={invert_a}
                        onChange={handleInvertAChange}
                    />
                }
                label="Invert" />
        </Stack>
    )
}

export default ControlChangeForm;