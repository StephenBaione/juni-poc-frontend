import React from 'react';

import { Box, Typography, Card } from '@mui/material';

import theme from '../../Theme';

export default function UserStatCard(props) {
    const {
        name,
        count
    } = props;

    return (
        <Card sx={{
            backgroundColor: theme.palette.background.secondary,
            textAlign: 'center',
            color: 'white',
            borderRadius: '0.5em',
            margin: '2em'
        }}>
            <Box sx={{ m: 2, width: '15em' }}>
                <Typography sx={{ pb: 2 }} variant='h5'>{name}</Typography>
                <Typography variant='h3'>{count}</Typography>
            </Box>
        </Card>
    )
}