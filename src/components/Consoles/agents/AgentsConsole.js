import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { Grid } from '@mui/material';

import ConsoleList from '../console/ConsoleList';

export default function AgentsConsole() {
    const userAgents = useSelector(state => state.agents.userAgents);

    const [title, setTitle] = useState('');
    const [fields, setFields] = useState('');

    return (
        <Grid
            container
        >
            {
                userAgents && userAgents.length > 0 &&
                userAgents.map((userAgent) => {

                })
            }
        </Grid>
    )
}
