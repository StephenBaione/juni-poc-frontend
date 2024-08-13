import React, { useEffect, useState } from 'react';

import {
    ListItem, ListItemText, ListItemAvatar, Avatar,
    Typography, Grid, IconButton, ListItemButton
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import MicIcon from "@mui/icons-material/Mic";

import { useSelector, useDispatch } from 'react-redux';
import { removeConversation, setActiveConversation } from '../../data/slices/conversations/conversationsSlice';
import { ConversationService } from '../../data/services/conversationService';

import theme from '../../Theme';

export default function ConversationListItem(props) {
    const activeConversation = useSelector((state) => state.activeConversation);
    const userFlows = useSelector(state => state.flows.userFlows);

    const conversationService = new ConversationService();

    const {
        conversation,
        handleDeleteConversation,
        showActions,
        showAudioConversation
    } = props;

    const [currentFlow, setCurrentFlow] = useState({});

    useEffect(() => {
        userFlows.map((flow) => {
            if (flow.id == conversation.flow_id) {
                setCurrentFlow(flow);
            }
        })
    }, []);

    const dispatch = useDispatch();
    const handleConversationItemClick = () => {
        if (activeConversation?.id !== conversation.id) dispatch(setActiveConversation(conversation));
    }

    const handleDeleteClick = () => {
        handleDeleteConversation(conversation.id);
    }

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
        } else if (showAudioConversation) {
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
                    <MicIcon />
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
            {showActions && conversation &&
                <ListItemButton
                    role={undefined}
                    dense
                    onClick={handleConversationItemClick}
                >
                    <ListItemAvatar>
                        <Avatar edge='start' alt={conversation.nickname} src={conversation.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={conversation.nickname}
                        secondary={
                            `${currentFlow?.name ? currentFlow.name : conversation.flow_id}`
                        }
                        primaryTypographyProps={{ 
                            style: {
                                fontWeight: activeConversation?.id === conversation.id ? 'bold' : 'normal',
                                color: 'white'
                            }
                        }}
                        secondaryTypographyProps={{
                            style: {
                                color: theme.palette.ListItem.textSecondary,
                            }
                        }}
                    />
                </ListItemButton>
            }

            {!showActions &&
                <ListItem
                    onClick={handleConversationItemClick}
                >
                    <ListItemAvatar>
                        <Avatar edge='start' alt={conversation.nickname} src={conversation.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={conversation.nickname}
                        secondary={
                            `${currentFlow?.name ? currentFlow.name : conversation.flow_id}`
                        }
                        primaryTypographyProps={{ 
                            style: {
                                fontWeight: activeConversation?.id === conversation.id ? 'bold' : 'normal',
                                color: 'white'
                            }
                        }}
                        secondaryTypographyProps={{
                            style: {
                                color: theme.palette.ListItem.textSecondary,
                            }
                        }}
                    />
                </ListItem>
            }
        </ListItem>
    )
}
