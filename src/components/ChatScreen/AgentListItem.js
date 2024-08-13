import React, { useState } from 'react';

import {
    ListItem, ListItemText, ListItemAvatar, Avatar,
    Typography, Grid, IconButton, ListItemButton, ListItemIcon
} from '@mui/material';

import SmartToyIcon from '@mui/icons-material/SmartToy';

import DeleteIcon from '@mui/icons-material/Delete';
import MicIcon from "@mui/icons-material/Mic";

import UpdateAgentDialog from './dialogs/UpdateAgentDialog';

import { useSelector, useDispatch } from 'react-redux';
import { removeConversation, setActiveConversation } from '../../data/slices/conversations/conversationsSlice';


import { AgentService } from '../../services/agentService';

import theme from '../../Theme';

export default function AgentListItem(props) {
    const {
        agent,
        handleDeleteAgent
    } = props;

    const currentUser = useSelector(state => state.currentUser?.user);

    const [updateAgentOpen, setUpdateAgentOpen] = useState(false);
    const agentService = new AgentService();

    const showActions = props.showActions !== undefined ? props.showActions : true;

    const dispatch = useDispatch();
    const handleDeleteClick = () => {
        handleDeleteAgent(agent.owner, agent.name);
    }

    const handleUpdateAgentClose = (value) => {
        if (value !== null) {
            agentService.updateAgent(value)
            .then((result) => {
                if (result === null) {
                    alert('Error Updating Agent.')
                }

                agentService.loadUserAgents(currentUser.id)
                .then(() => {
                    setUpdateAgentOpen(false);
                });
            })
        }

        setUpdateAgentOpen(false);
    };

    const secondaryActions = () => {
        if (showActions) {
            return (
                <IconButton
                    sx={{
                        color: 'white',

                        '&:hover': {
                            color: 'black',
                            background: 'white',
                            transition: '0.2s ease-in-out',
                        }
                    }}
                    edge="end"
                    aria-label="delete"
                    onClick={handleDeleteClick}
                >
                    <DeleteIcon />
                </IconButton>
            )
        }
    }

    return (
        <ListItem
            secondaryAction={
                secondaryActions()
            }
        >
            {showActions &&
                <ListItemButton
                    onClick={() => { setUpdateAgentOpen(!updateAgentOpen) }}
                >
                    <ListItemIcon
                        sx={{
                            color: 'white'
                        }}
                    >
                        <SmartToyIcon edge='start' />
                    </ListItemIcon>
                    <ListItemText
                        primary={`${agent.name} - ${agent.type}`}
                        secondary={`${agent.service}`}
                        primaryTypographyProps={{
                            color: 'white'
                        }}
                        secondaryTypographyProps={{
                            style: {
                                color: 'white',
                            }
                        }}
                    />
                </ListItemButton>
            }

            {!showActions &&
                <ListItemButton
                    onClick={() => { setUpdateAgentOpen(!updateAgentOpen) }}
                >
                    <ListItemIcon>
                        <SmartToyIcon edge='start' />
                    </ListItemIcon>
                    <ListItemText
                        primary={`${agent.name} - ${agent.type}`}
                        secondary={`${agent.service}`}
                        secondaryTypographyProps={{
                            style: {
                                color: theme.palette.ListItem.textSecondary,
                            }
                        }}
                    />
                </ListItemButton>
            }

            <UpdateAgentDialog
                open={updateAgentOpen}
                onClose={handleUpdateAgentClose}
                currentAgent={agent}
            />
        </ListItem>
    )
}
