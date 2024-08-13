import React, { useState } from 'react'

import {
    Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
    TextField, Button, Typography, Select, MenuItem
} from "@mui/material";
import { useSelector } from 'react-redux';

export default function AddOutputDialog(props) {
    const {
        onClose,
        open,
        flowAvailabilityConfig,
    } = props;

    const [flowOutput, setFlowOutput] = useState('');

    const handleClose = () => {
        onClose(null);
    }

    const handleSubmit = () => {
        onClose(flowOutput);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New Output</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Add Output Node to your Flow
                </DialogContentText>
                {flowAvailabilityConfig?.AvailableOutputs &&
                    <div>
                        <Typography>Output</Typography>
                        <Select
                            value={flowOutput}
                            label="Agent:"
                            fullWidth
                            onChange={(e) => {
                                const currentFlowOutput = e.target.value;
                                setFlowOutput(currentFlowOutput);
                            }}
                        >
                            {/* First, User selects which input type to use */}
                            {
                                Object.keys(flowAvailabilityConfig?.AvailableOutputs).map((flowOutputType) => {
                                    return (
                                        <MenuItem value={flowOutputType}>{flowOutputType}</MenuItem>
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

