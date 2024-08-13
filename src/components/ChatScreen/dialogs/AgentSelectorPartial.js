import React, { useEffect } from 'react'

import { useState } from 'react';

import {
    Grid,
    Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
    TextField, Button, InputLabel, Select, MenuItem, Typography,
    Collapse, Divider,
    List, ListItemButton, ListItem, ListItemText, IconButton, stepButtonClasses
} from '@mui/material';
import { useSelector } from 'react-redux';

export default function AgentSelectorPartial(props) {
    const {
        handleOnChange,
        useDefaults,
        defaultValues,
    } = props;

    const availableAgentsConfig = useSelector(state => state.agents.availableAgentsConfig);

    const [service, setService] = useState('openai');
    const [type, setType] = useState('chat_gpt');
    const [inputType, setInputType] = useState('text');
    const [outputType, setOutputType] = useState('text');

    const handleChange = (field, value) => {
        handleOnChange(field, value)
    }

    useEffect(() => {
        if (useDefaults) {
            setService(defaultValues.service);
            setInputType(defaultValues.inputType);
            setOutputType(defaultValues.outputType);
            setType(defaultValues.type);
        }
    }, []);

    return (
        <Grid>
            <Typography>Agent Type</Typography>
            <Select
                value={type}
                label="Agent Type"
                fullWidth
                onChange={(e) => {
                    const agentType = e.target.value;
                    setType(agentType);
                    handleChange('setType', agentType);
                }}
            >
                {
                    Object.keys(availableAgentsConfig?.AvailableAgents).map((agentType) => {
                        return (
                            <MenuItem value={agentType}>{agentType}</MenuItem>
                        )
                    })
                }
            </Select>

            {
                type !== '' &&
                <div>
                    <Typography>Agent Service</Typography>
                    <Select
                        value={service}
                        label="Agent Service"
                        fullWidth
                        onChange={(e) => {
                            const service = e.target.value;
                            setService(service);
                            handleChange('setService', service);
                        }}
                    >
                        <MenuItem value={
                            availableAgentsConfig.AvailableAgents[type]?.Service
                        }>
                            {
                                availableAgentsConfig.AvailableAgents[type]?.ServiceLabel
                            }
                        </MenuItem>
                    </Select>
                </div>
            }

            {
                type !== '' &&
                <div>
                    <Typography>Input Type</Typography>
                    <Select
                        value={inputType}
                        label="Input Type"
                        fullWidth
                        onChange={(e) => {
                            const inputType = e.target.value;
                            setInputType(inputType);
                            handleChange('setInputType', inputType);
                        }}
                    >
                        <MenuItem value={
                            availableAgentsConfig.AvailableAgents[type]?.InputType
                        }>
                            {
                                availableAgentsConfig.AvailableAgents[type]?.InputTypeLabel
                            }
                        </MenuItem>
                    </Select>
                </div>
            }

            {
                type !== '' &&
                <div>
                    <Typography>Output Type</Typography>
                    <Select
                        value={outputType}
                        label="Output Type"
                        fullWidth
                        onChange={(e) => {
                            const outputType = e.target.value;
                            setOutputType(outputType);
                            handleChange('setOutputType', outputType);
                        }}
                    >
                        <MenuItem value={
                            availableAgentsConfig.AvailableAgents[type]?.OutputType
                        }>
                            {
                                availableAgentsConfig.AvailableAgents[type]?.OutputTypeLabel
                            }
                        </MenuItem>
                    </Select>
                </div>
            }
        </Grid>
    )
}
