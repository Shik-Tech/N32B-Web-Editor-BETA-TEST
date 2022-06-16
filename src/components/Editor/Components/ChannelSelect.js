import { map } from "lodash";
import React from "react";

function ChannelSelect({ disabled, channel, handleChannelChange }) {
    const options = [];
    for (let i = 0; i < 16; i++) {
        options[i] = i + 1;
    }
    return (
        <select disabled={disabled} value={channel} onChange={handleChannelChange}>
            <option value={0} key={0}>Use Global Channel</option>
            {map(options, value =>
                <option value={value} key={value}>Channel {value}</option>
            )}
        </select>
    )
}

export default ChannelSelect;