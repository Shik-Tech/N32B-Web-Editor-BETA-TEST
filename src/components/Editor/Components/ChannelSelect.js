import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { map } from "lodash";
import React from "react";

function ChannelSelect({ channel, handleChannelChange }) {
    const options = [];
    for (let i = 0; i < 16; i++) {
        options[i] = i + 1;
    }
    return (
        <FormControl fullWidth>
            <InputLabel id="channel-select-label">Channel</InputLabel>
            <Select
                labelId="channel-select-label"
                id="channel-select"
                label="Channel"
                variant="standard"
                value={channel}
                onChange={handleChannelChange}
            >
                <MenuItem value={0} key={0}>Use Global Channel</MenuItem>
                {map(options, value =>
                    <MenuItem value={value} key={value}>Channel {value}</MenuItem>
                )}
            </Select>
        </FormControl>
    )
}

export default ChannelSelect;