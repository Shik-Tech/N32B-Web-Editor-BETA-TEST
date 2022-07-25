import {
    FormControl,
    InputAdornment,
    Stack,
    TextField
} from "@mui/material";
import React from "react";

function SysExForm({
    currentKnob,
    handleSysExChange
}) {
    const {
        sysExMessage
    } = currentKnob;

    return (
        <Stack
            direction="row"
            spacing={2}
        >
            <FormControl sx={{minWidth: 410}}>
                <TextField
                    value={sysExMessage.join(' ')}
                    onChange={handleSysExChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">F0</InputAdornment>,
                        endAdornment: <InputAdornment position="end">MSB LSB F7</InputAdornment>,
                    }}
                />
            </FormControl>

        </Stack>
    )
}

export default SysExForm;