import React, { useEffect, useState } from 'react';

import {
    Grid,
    Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
    TextField, Button, InputLabel, Select, MenuItem, Typography,
    Collapse, Divider,
    List, ListItemButton, ListItem, ListItemText, IconButton
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { InternalService } from '../../../data/services/internalService';

import { useSelector } from 'react-redux';

import SelectComponent from '../../misc/selectComponent';
import { current } from '@reduxjs/toolkit';

import AgentSelectorPartial from './AgentSelectorPartial';

export default function UpdateAgentDialog(props) {
    const {
        onClose,
        open,
        currentAgent,
    } = props;

    const currentUser = useSelector((state) => state.currentUser)

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [purpose, setPurpose] = useState('');
    const [service, setService] = useState('openai');
    const [type, setType] = useState('chat_gpt');
    const [inputType, setInputType] = useState('text');
    const [outputType, setOutputType] = useState('text');

    const handleSubmit = () => {
        const value = {
            id,
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

    useEffect(() => {
        setId(currentAgent.id)
        setName(currentAgent.name)
        setService(currentAgent.service)
        setType(currentAgent.type)
        setInputType(currentAgent.input_type)
        setOutputType(currentAgent.output_type)
        setPurpose(currentAgent.purpose)
    }, []);

    const handleClose = () => {
        onClose(null);
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
            <DialogTitle>Update Agent</DialogTitle>
            <DialogContent>
                <AgentSelectorPartial
                    handleOnChange={handleSelectorChange}
                    useDefaults={true}
                    defaultValues={{
                        service: currentAgent.service,
                        inputType: currentAgent.input_type,
                        outputType: currentAgent.output_type,
                        type: currentAgent.type,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}
