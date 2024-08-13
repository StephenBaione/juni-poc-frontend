import React, { useState } from 'react'

import { Box, Button, Grid, TextField, Divider } from '@mui/material'

import UserService from '../../services/userService';

export default function SignupForm(props) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onSubmit = props.onSubmit;

    const userService = new UserService();

    const handleUserSignup = () => {
        userService.signUp(
            username,
            password,
            email
        )
    }

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
                    label="Username:"
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Divider
                    sx={{
                        height: '1em'
                    }}
                />

                <TextField
                    label="Email:"
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
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
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

                <TextField
                    label="Confirm Password:"
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
                    value={confirmPassword}
                    onChange={(e) => {setConfirmPassword(e.target.value)}}
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
                        }
                    }}
                    onClick={
                        () => { 
                            onSubmit({
                                username,
                                password,
                                email
                            })
                        }
                    }
                >Signup</Button>
            </Grid>
        </Box>
    )
}
