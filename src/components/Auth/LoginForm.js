import React, { useState } from 'react'

import { Box, Button, Grid, TextField, Divider } from '@mui/material'

import ForgotPasswordDialog from './ForgotPasswordDialog';

export default function Confirm(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = props.onSubmit;

    // forgot password dialog
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

    const handleForgotPasswordClick = () => {
        setForgotPasswordOpen(true);
    };

    const handleForgotPasswordClose = () => {
        setForgotPasswordOpen(false);
    };  

    return (
        <Box
            component={'form'}
            sx={{
                padding: '1em',
                height: '100%'
            }}
        >
            <Grid
                container
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{
                    padding: '1em 0 1em 0',
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
                    label="Password:"
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
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                        "&:hover": {
                            color: 'black',
                            background: 'white',
                            transition: '0.2s ease-in-out'
                        }
                    }}
                    onClick={() => {
                        onSubmit({
                            email,
                            password
                        })
                    }}
                >Login</Button>
                
                <Button 
                    variant="text"
                    onClick={handleForgotPasswordClick}
                    sx={{
                        width: '100%',
                        padding: '1em',
                    }}
                >
                    Forgot Password?
                </Button>
                <ForgotPasswordDialog
                    open={forgotPasswordOpen}
                    onClose={handleForgotPasswordClose}
                />
            </Grid>
        </Box>
    )
}
