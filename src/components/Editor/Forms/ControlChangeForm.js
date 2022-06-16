import React from "react";
import ChannelSelect from "../Components/ChannelSelect";

function ControlChangeForm({
    currentKnob,
    handleChannelChange,
    handleMSBChange,
    handleInvertAChange
}) {
    const {
        channel,
        msb,
        invert_a
    } = currentKnob;

    return (
        <div className="row editorRow">
            <div className="column">
                <label>Channel</label>
                <ChannelSelect channel={channel} handleChannelChange={handleChannelChange} />
            </div>

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
    )
}

export default ControlChangeForm;