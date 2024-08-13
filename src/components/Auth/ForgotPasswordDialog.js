import React, {useState} from 'react'

import {
    Grid,
    Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
    TextField, Button, InputLabel, Select, MenuItem, Typography,
    Collapse, Divider,
    List, ListItemButton, ListItem, ListItemText, IconButton, stepButtonClasses, Icon
} from '@mui/material';

import UserService from '../../services/userService';

export default function ForgotPasswordDialog(props) {
    const {
        onClose,
        open,
    } = props;

    const userService = new UserService();

    // dialog values
    const [email, setEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [password, setPassword] = useState('');

    // step values. 
    // 1. email: user enters email, email is validated, confirmation code is sent
    // 2. reset: user enters confirmation code and new password
    // 3. login: new password is validated, and if successful, user is redirected to login page
    const stepValues = ['email', 'reset', 'login']
    const [activeButton, setActiveButton] = useState('email');
    
    const handleActiveButtonClick = (activeValue) => {
        if (activeButton === activeValue || !stepValues.includes(activeButton)) return;
        setActiveButton(activeValue)
    }

    const handleSetEmail = (value) => {
        setEmail(value);
    };

    const handleSetConfirmationCode = (value) => {
        setConfirmationCode(value);
    };

    const handleSetPassword = (value) => {
        setPassword(value);
    };

    const handleClose = () => {
        resetDialogValues();
        onClose(null);
    };

    const resetDialogValues = () => {
        setEmail('')
        setConfirmationCode('')
        setPassword('')
        setActiveButton(stepValues[0])
    };

    const handleSubmit = async () => {
        // change behavior based on active button
        if (activeButton === stepValues[0]) {
            // send confirmation code
            const result = await userService.getForgotPasswordResetCode(email)
            if (result && result.httpStatusCode === 200) {
                setActiveButton(stepValues[1]);
            }
        } 
        
        else if (activeButton === stepValues[1]) {
            // reset password
            const result = await userService.resetPassword(email, confirmationCode, password)
            if (result) {
                setActiveButton(stepValues[2]);
            }
            
        } else {
            handleClose()
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            {
                activeButton !== stepValues[2] &&
                <DialogTitle sx={{ 'textAlign': 'center'}}>Forgot Password</DialogTitle>
            }

            {
                activeButton === stepValues[0] &&
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        variant="standard"
                        value={email}
                        onChange={(e) => handleSetEmail(e.target.value)}
                        sx = {{
                            width: '20em'
                        }}
                    />
                </DialogContent>
            }

            {
                activeButton === stepValues[1] &&
                <DialogContent sx={{width: '20em'}}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Confirmation Code"
                        variant="standard"
                        value={confirmationCode}
                        onChange={(e) => handleSetConfirmationCode(e.target.value)}
                        sx = {{
                            width: '20em'
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Password"
                        variant="standard"
                        type='password'
                        value={password}
                        onChange={(e) => handleSetPassword(e.target.value)}
                        sx = {{
                            width: '20em'
                        }}
                    />
                </DialogContent>

            }

            {
                activeButton === stepValues[2] &&
                <Typography variant="h6" sx={{p:'3em 2em 2em 2em'}}>Password has been reset.</Typography>
            }

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                >
                    {activeButton}
                </Button>
            </DialogActions>
        </Dialog>
    )
}