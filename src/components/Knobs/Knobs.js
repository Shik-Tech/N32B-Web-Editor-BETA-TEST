import { Grid } from '@mui/material';
import React from 'react';
import Knob from './Knob';

function Knobs({ knobsData, selectedKnobIndex, setSelectedKnob }) {
    return (
        <Grid
            container
            columns={{ md: 8 }}
            rowSpacing={3.45}
            spacing={-20.2}
            sx={{ pt: 15.2, pl: 4.6, minWidth: 605 }}
        >
            {knobsData.map((data, index) =>
                <Grid item key={index} xs={1}>
                    <Knob
                        {...data}
                        setSelectedKnob={setSelectedKnob}
                        selectedKnobIndex={selectedKnobIndex} />
                </Grid>
            )}
        </Grid>
    )
}

export default Knobs;





