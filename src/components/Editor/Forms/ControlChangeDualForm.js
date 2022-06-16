import React from "react";
import ChannelSelect from "../Components/ChannelSelect";

function ControlChangeDualForm({
    currentKnob,
    handleChannelChange,
    handleMSBChange,
    handleLSBChange,
    handleInvertAChange,
    handleInvertBChange
}) {
    const {
        channel,
        msb,
        lsb,
        invert_a,
        invert_b
    } = currentKnob;

    return (
        <div className="column">
            <div className="row editorRow">
                <div className="column">
                    <label>Channel</label>
                    <ChannelSelect channel={channel} handleChannelChange={handleChannelChange} />
                </div>
            </div>
            <div className="subtitle">Knob Message A:</div>
            <div className="row editorRow">
                <div className="column">
                    <label>Control Number</label>
                    <input type="number" min={0} max={127} value={msb} onChange={handleMSBChange} />
                </div>

                <div className="column">
                    <label>
                        <input type="checkbox" checked={invert_a} onChange={handleInvertAChange} />
                        Invert
                    </label>
                </div>
            </div>

            <div className="subtitle">Knob Message B:</div>
            <div className="row editorRow">
                <div className="column">
                    <label>Control Number</label>
                    <input type="number" min={0} max={127} value={lsb} onChange={handleLSBChange} />
                </div>

                <div className="column">
                    <label>
                        <input type="checkbox" checked={invert_b} onChange={handleInvertBChange} />
                        Invert
                    </label>
                </div>
            </div>
        </div>
    )
}

export default ControlChangeDualForm;