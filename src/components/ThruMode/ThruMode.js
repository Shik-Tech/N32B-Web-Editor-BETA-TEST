import React from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import { map } from 'lodash';

function ThruMode({ thruMode, handleThruModeChange, thruOptions }) {
    return (
        <FormControl fullWidth>
            <InputLabel id="thru-mode-label">Thru Mode</InputLabel>
            <Select
                labelId="thru-mode-label"
                id="thru-mode-select"
                label="Thru Mode"

                value={thruMode}
                onChange={handleThruModeChange}
            >
                {map(thruOptions, ({value, name}) =>
                    <MenuItem value={value} key={value}>{name}</MenuItem>
                )}
            </Select>
        </FormControl>
    );
}

export default ThruMode;