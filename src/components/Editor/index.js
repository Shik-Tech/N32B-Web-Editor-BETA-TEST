import { Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { Container } from "@mui/system";
import { map } from "lodash";
import React from "react";
import { validateValueRange } from "../PresetOperations/utils";
import {
    ControlChangeDualForm,
    ControlChangeForm,
    ControlChangeHiResForm,
    ControlChangeRPNForm
} from "./Forms";
import { ModeIndexes, Modes } from "./Modes";

function Editor({ knobData, handleKnobDataChange, setIsPristine }) {
    function handleModeSelect(e) {
        let newData = {
            mode: parseInt(e.target.value)
        }

        if (newData.mode === ModeIndexes.KNOB_MODE_HIRES && knobData.msb > 31) {
            newData = {
                ...newData,
                msb: 0,
                lsb: 32
            }
        }
        handleKnobDataChange(newData);
    }

    function handleChannelChange(e) {
        handleKnobDataChange({
            channel: parseInt(e.target.value)
        });
    }

    function handleMSBChange(e) {
        handleKnobDataChange({
            msb: validateValueRange(e.target)
        });
    }
    function handleLSBChange(e) {
        handleKnobDataChange({
            lsb: validateValueRange(e.target)
        });
    }

    function handleHiResChange(e) {
        handleKnobDataChange({
            msb: validateValueRange(e.target),
            lsb: validateValueRange(e.target) + 32
        });
    }

    function handleInvertValueAChange(e) {
        handleKnobDataChange({
            invert_a: e.target.checked
        });
    }

    function handleInvertValueBChange(e) {
        handleKnobDataChange({
            invert_b: e.target.checked
        });
    }

    const displayForms = [
        <></>,
        <ControlChangeForm
            currentKnob={knobData}
            handleChannelChange={handleChannelChange}
            handleMSBChange={handleMSBChange}
            handleInvertAChange={handleInvertValueAChange}
        />,
        <ControlChangeDualForm
            currentKnob={knobData}
            handleChannelChange={handleChannelChange}
            handleMSBChange={handleMSBChange}
            handleLSBChange={handleLSBChange}
            handleInvertAChange={handleInvertValueAChange}
            handleInvertBChange={handleInvertValueBChange}
        />,
        <ControlChangeRPNForm
            currentKnob={knobData}
            handleChannelChange={handleChannelChange}
            handleMSBChange={handleMSBChange}
            handleLSBChange={handleLSBChange}
            handleInvertAChange={handleInvertValueAChange}
        />,
        <ControlChangeRPNForm
            currentKnob={knobData}
            handleChannelChange={handleChannelChange}
            handleMSBChange={handleMSBChange}
            handleLSBChange={handleLSBChange}
            handleInvertAChange={handleInvertValueAChange}
        />,
        <ControlChangeHiResForm
            currentKnob={knobData}
            handleChannelChange={handleChannelChange}
            handleHiResChange={handleHiResChange}
            handleInvertAChange={handleInvertValueAChange}
        />
    ];

    return (
        <Stack
            divider={<Divider variant="middle"  />}
            spacing={2}
        >
            <FormControl fullWidth>
                <InputLabel id="mode-select-label">Mode</InputLabel>
                <Select
                    labelId="mode-select-label"
                    id="mode-select"
                    label="Mode"
                    value={knobData.mode}
                    onChange={handleModeSelect}
                >
                    {map(Modes, mode =>
                        <MenuItem value={mode.value} key={mode.value}>{mode.name}</MenuItem>
                    )}
                </Select>
            </FormControl>
            {displayForms[knobData.mode]}
        </Stack>
    );
}

export default Editor;