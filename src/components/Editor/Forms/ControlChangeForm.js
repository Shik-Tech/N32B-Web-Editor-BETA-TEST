import {
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Stack,
    TextField
} from "@mui/material";
import React from "react";

function ControlChangeForm({
    currentKnob,
    handleMSBChange,
    handleInvertValueAChange
}) {
    const {
        msb,
        invert_a
    } = currentKnob;

    return (
        <Stack
            direction="row"
            spacing={2}
        >
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
                        onChange={handleInvertValueAChange}
                    />
                }
                label="Invert" />
        </Stack>
    )
}

export default ControlChangeForm;