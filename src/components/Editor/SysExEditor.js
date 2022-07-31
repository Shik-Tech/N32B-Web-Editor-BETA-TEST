import { Stack } from "@mui/material";
import React from "react";
import {
    SysExForm
} from "./Forms";

function SysExEditor(props) {
    return (
        <Stack
            spacing={2}
        >
            <SysExForm {...props}/>
        </Stack>
    );
}

export default SysExEditor;