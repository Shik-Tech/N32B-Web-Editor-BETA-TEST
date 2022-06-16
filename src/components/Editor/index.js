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
        <div className="editorContainer">
            <div className="row editorRow">
                <label>Mode</label>
                <select value={knobData.mode} onChange={handleModeSelect}>
                    {map(Modes, mode =>
                        <option value={mode.value} key={mode.value}>{mode.name}</option>
                    )}
                </select>
            </div>

            {displayForms[knobData.mode]}
        </div>
    );
}

export default Editor;