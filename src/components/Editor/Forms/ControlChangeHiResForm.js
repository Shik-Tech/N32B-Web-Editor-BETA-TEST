import { Checkbox, Divider, FormControl, FormControlLabel, Stack, TextField } from "@mui/material";
import React from "react";

function ControlChangeHiResForm({
    currentKnob,
    handleHiResChange,
    handleInvertValueAChange
}) {
    const {
        msb,
        lsb,
        invert_a
    } = currentKnob;

    return (
        <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
        >

            <FormControl fullWidth>
                <TextField
                    label="MSB"
                    type="number"

                    InputProps={{ inputProps: { min: 0, max: 31 } }}
                    value={msb}
                    onChange={handleHiResChange}
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    label="LSB"
                    type="number"
                    disabled={true}
                    InputProps={{ inputProps: { min: 0, max: 31 } }}
                    value={lsb}
                />
            </FormControl>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={invert_a}
                        onChange={handleInvertValueAChange}
                    />
                }
                label="Invert" />
        </Stack>
    )
}

export default ControlChangeHiResForm;