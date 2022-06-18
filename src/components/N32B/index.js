import { Container } from '@mui/material';
import React from 'react';
import { Knobs } from '../../components';

function N32B(props) {
    return (
        <Container disableGutters={true} className="N32B" fixed>
            <Knobs {...props} />
        </Container>
    );
}

export default N32B;