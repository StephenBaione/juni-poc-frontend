import React, { useEffect, useState } from 'react';

import {
    Grid,
    Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
    TextField, Button, InputLabel, Select, MenuItem, Typography,
    Collapse, Divider,
    List, ListItemButton, ListItem, ListItemText, IconButton, stepButtonClasses
} from '@mui/material';

import { useSelector } from 'react-redux';

import SelectComponent from '../../misc/selectComponent';

import AgentSelectorPartial from './AgentSelectorPartial';
import { useResolvedPath } from 'react-router-dom';

export default function NewAgentDialog(props) {
    const {
        onClose,
        open,
    } = props;

    const currentUser = useSelector((state) => state.currentUser)
    const agents = useSelector(state => state.agents);

    const [name, setName] = useState('');
    const [purpose, setPurpose] = useState('');
    const [service, setService] = useState('openai');
    const [type, setType] = useState('chat_gpt');
    const [inputType, setInputType] = useState('text');
    const [outputType, setOutputType] = useState('text');

    const handleSubmit = () => {
        const value = {
            name,
            service,
            type,
            inputType,
            owner: currentUser.user.id,
            outputType,
            purpose
        };
        onClose(value);
    };

    const handleClose = () => {
        resetDialogValues();
        onClose(null);
    };

    const resetDialogValues = () => {
        setName('')
        setService('')
        setType('')
        setInputType('')
        setOutputType('')
        setPurpose('')
    };

    const handleSelectorChange = (operation, value) => {
        switch (operation) {
            case 'setName':
                setName(value);
                break;
            case 'setService':
                setService(value);
                break;
            case 'setType':
                setType(value);
                break;
            case 'setInputType':
                setInputType(value);
                break;
            case 'setOutputType':
                setOutputType(value);
                break;
            case setPurpose(value):
                setPurpose(value);
                break;
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New Agent</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    New Agent
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Agent Name"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <AgentSelectorPartial 
                    handleOnChange={handleSelectorChange}
                    availableAgents={agents?.availableAgentsConfig.AvailableAgentsConfig}
                />

                <TextField
                    margin="dense"
                    label="Purpose"
                    fullWidth
                    variant="standard"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}
