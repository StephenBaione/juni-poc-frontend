import React, { useState } from 'react'

import {
    Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
    TextField, Button, Typography, Select, MenuItem
} from "@mui/material";
import { useSelector } from 'react-redux';

export default function AddInputDialog(props) {
    const {
        onClose,
        open,
        flowAvailabilityConfig,
    } = props;

    const [flowInput, setFlowInput] = useState('');

    const handleClose = () => {
        onClose(null);
    }

    const handleSubmit = () => {
        onClose(flowInput);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New Input</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Add Input Node to your Flow
                </DialogContentText>
                {flowAvailabilityConfig?.AvailableInputs &&
                    <div>
                        <Typography>Input</Typography>
                        <Select
                            value={flowInput}
                            label="Agent:"
                            fullWidth
                            onChange={(e) => {
                                const currentFlowInput = e.target.value;
                                setFlowInput(currentFlowInput);
                            }}
                        >
                            {/* First, User selects which input type to use */}
                            {
                                Object.keys(flowAvailabilityConfig?.AvailableInputs).map((flowInputType) => {
                                    return (
                                        <MenuItem value={flowInputType}>{flowInputType}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </div>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}

