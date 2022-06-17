import React from "react";
import {
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Stack,
    TextField
} from "@mui/material";

function ControlChangeDualForm({
    currentKnob,
    handleMSBChange,
    handleLSBChange,
    handleInvertValueAChange,
    handleInvertValueBChange
}) {
    const {
        msb,
        lsb,
        invert_a,
        invert_b
    } = currentKnob;

    return (
        <Stack
            divider={<Divider variant="middle" />}
            spacing={2}
        >
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                <FormControl fullWidth>
                    <TextField
                        label="Control Number A"
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

            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                <FormControl fullWidth>
                    <TextField
                        label="Control Number B"
                        type="number"

                        InputProps={{ inputProps: { min: 0, max: 127 } }}
                        value={lsb}
                        onChange={handleLSBChange}
                    />
                </FormControl>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={invert_b}
                            onChange={handleInvertValueBChange}
                        />
                    }
                    label="Invert" />
            </Stack>
        </Stack>
    )
}

export default ControlChangeDualForm;