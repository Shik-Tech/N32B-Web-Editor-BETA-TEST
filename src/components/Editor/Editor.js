import { Divider, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { map } from "lodash";
import React from "react";
import ChannelSelect from "./Components/ChannelSelect";
import {
    ControlChangeDualForm,
    ControlChangeForm,
    ControlChangeHiResForm,
    ControlChangeRPNForm
} from "./Forms";
import { Modes } from "./Modes";

function Editor(props) {
    const {
        currentKnob,
        handleModeSelect,
        handleChannelChange
    } = props;

    const displayForms = [
        <></>,
        <ControlChangeForm {...props} />,
        <ControlChangeDualForm {...props} />,
        <ControlChangeRPNForm {...props} />,
        <ControlChangeRPNForm {...props} />,
        <ControlChangeHiResForm {...props} />
    ];

    return (
        <Stack
            divider={<Divider variant="middle" />}
            spacing={2}
        >
            <FormControl fullWidth>
                <InputLabel id="mode-select-label">Mode</InputLabel>
                <Select
                    labelId="mode-select-label"
                    id="mode-select"
                    label="Mode"
                    value={currentKnob.mode}
                    onChange={handleModeSelect}
                >
                    {map(Modes, mode =>
                        <MenuItem value={mode.value} key={mode.value}>{mode.name}</MenuItem>
                    )}
                </Select>
            </FormControl>

            <ChannelSelect channel={currentKnob.channel} handleChannelChange={handleChannelChange} />

            {displayForms[currentKnob.mode]}
        </Stack>
    );
}

export default Editor;