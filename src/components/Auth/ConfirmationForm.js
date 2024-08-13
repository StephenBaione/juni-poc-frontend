import React, { useState } from 'react'

import { Box, Button, Grid, TextField, Divider } from '@mui/material'

export default function ConfirmForm(props) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const onSubmit = props.onSubmit;
    const handleResendConfirmationCode = props.handleResendConfirmationCode;

    return (
        <Box
            component={'form'}
            sx={{
                background: 'white',
                padding: '1em'
            }}
        >
            <Grid
                container
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{
                    padding: '1em 0 1em 0'
                }}
            >
                <TextField
                    label="Email:"
                    variant='outlined'
                    sx={{
                        width: '100%'
                    }}
                    inputProps={{
                        style: {
                            padding: '1em',
                        }
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Divider
                    sx={{
                        height: '1em'
                    }}
                />

                <TextField
                    label="Confirmation Code:"
                    variant='outlined'
                    sx={{
                        width: '100%'
                    }}
                    inputProps={{
                        style: {
                            padding: '1em',
                            width: '100%'
                        }
                    }}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <Divider
                    sx={{
                        height: '1em'
                    }}
                />

                <Button
                    variant='outline'
                    sx={{
                        width: '100%',
                        background: 'black',
                        color: 'white',
                        marginBottom: '1em',

                        "&:hover": {
                            color: 'black'
                        }
                    }}
                    onClick={() => {
                        handleResendConfirmationCode({
                            email
                        })
                    }}
                >
                    Re-Send Code
                </Button>

                <Button
                    variant='outline'
                    sx={{
                        width: '100%',
                        background: 'black',
                        color: 'white',

                        "&:hover": {
                            color: 'black'
                        }
                    }}
                    onClick={() => {
                        onSubmit({
                            email,
                            code
                        })
                    }}
                >Confirm</Button>
            </Grid>
        </Box>
    )
}
