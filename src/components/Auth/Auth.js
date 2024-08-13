import React, { useEffect } from 'react';

import {
    Grid, Box, TextField, Divider,
    ButtonGroup, Button,
    Card, CardHeader, CardContent, CardActionArea
} from '@mui/material';

import { useState } from 'react';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ConfirmForm from './ConfirmationForm';

import UserService from '../../services/userService';

import { User } from '../../services/userService';

import { useDispatch } from 'react-redux';
import { setUser } from '../../data/slices/user/currentUserSlice';
import { useSelector } from 'react-redux';

import { routeMap } from '../utils';

import { Navigate } from 'react-router-dom';

import theme from '../../Theme';

export default function Auth() {
    const [activeButton, setActiveButton] = useState('login');
    const dispatch = useDispatch();

    const user = useSelector((state) => state.currentUser.user);

    const handleActiveButtonClick = (activeValue) => {
        if (activeButton === activeValue || !['login', 'signup', 'confirm'].includes(activeButton)) return;

        setActiveButton(activeValue)
    }

    const userService = new UserService();

    const handleSignUp = (data) => {
        userService.signUp(data.username, data.password, data.email)
        .then((creationResult) => {
            if (creationResult.success) {
                if (creationResult.Item !== {}) {
                    setActiveButton('login')
                } else {
                    dispatch(setUser(creationResult.Item))
                    setActiveButton('confirm');
                }
            }
    
            setActiveButton('confirm')
        });

    }

    const handleConfirmSignUp = (data) => {
        userService.confirmSignUp(data.email, data.code, localStorage.getItem('user_id'))
            .then((result) => {
                if (result) setActiveButton('login');

                else {
                    alert('Error Confirming User');
                }
            });
    }

    const handleResendConfirmationCode = (data) => {
        userService.resendConfirmationCode(data.email)
            .then((result) => {
                if (result) alert('Code sent');
            })
    }

    const handleLogin = (data) => {
        try {
            return userService.login(data.email, data.password)
                .then((result) => {
                    if (result.success) {
                        userService.loadUserFromLocal()
                        .then(() => {
                            return <Navigate to={routeMap['home']} replace />
                        })
                    }
                });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Grid
            container
            style={{
                height: '100vh',
            }}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <Card
                style={{
                    width: '25%',
                    height: '50%',
                }}
                >
                <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}
                    style={{
                        background: theme.palette.pinkGradient.main,
                        padding: '1em',
                        margin: 'auto'
                    }}
                >
                    <Button
                        sx={{
                            "&:hover": {
                                background: 'lightgrey'
                            }
                        }}
                        style={{
                            color: 'white',
                            background: activeButton === 'login' ? 'black' : null,
                            width: '33%',
                        }}
                        onClick={() => {
                            handleActiveButtonClick('login')
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        style={{
                            color: 'white',
                            background: activeButton === 'signup' ? 'black' : null,
                            width: '33%',
                        }}
                        sx={{
                            "&:hover": {
                                background: 'lightgrey',
                                color: 'black'
                            }
                        }}
                        onClick={() => {
                            handleActiveButtonClick('signup')
                        }}
                    >
                        Signup
                    </Button>
                    <Button
                        style={{
                            color: 'white',
                            background: activeButton === 'confirm' ? 'black' : null,
                            width: '33%',
                        }}
                        sx={{
                            "&:hover": {
                                background: 'lightgrey',
                                color: 'black'
                            }
                        }}
                        onClick={() => {
                            handleActiveButtonClick('confirm')
                        }}
                    >
                        Confirm
                    </Button>
                </Grid>
                {activeButton === 'login' &&
                    <LoginForm
                        onSubmit={handleLogin}
                    />
                }
                {activeButton === 'signup' &&
                    <SignupForm
                        onSubmit={handleSignUp}
                    />
                }
                {
                    activeButton === 'confirm' &&
                    <ConfirmForm
                        onSubmit={handleConfirmSignUp}
                        handleResendConfirmationCode={handleResendConfirmationCode}
                    />
                }
            </Card>
        </Grid>
    )
}
