import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
    Grid,
    List,
    Button
} from '@mui/material';

import ConversationListItem from './ConversationListItem';

import { setActiveConversation } from '../../data/slices/conversations/conversationsSlice';

import NewConversationDialog from './dialogs/NewConversationDialog';

import { useState } from 'react';

import { ConversationService } from '../../data/services/conversationService';

import { setUserConversations } from '../../data/slices/conversations/conversationsSlice';

export default function ConversationList(props) {
    const currentUser = useSelector(state => state.currentUser);
    const userConversations = useSelector(state => state.conversations.userConversations);
    const conversationService = new ConversationService();

    const {
        customContentStyle,
    } = props;

    const [newConversationOpen, setNewConversationOpen] = useState(false);
    const [conversations, setConversations] = useState([]);

    const dispatch = useDispatch();

    const handleNewConversationClick = () => {
        setNewConversationOpen(true);
    };

    const handleDeleteConversation = (value) => {
        conversationService.deleteConversation(currentUser.user.id, value)
            .then(() => {
                conversationService.loadUserConversations(currentUser.user.id);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleNewConversationClose = (value) => {
        if (value !== null) {
            conversationService.addConversation(value)
                .then((conversation) => {
                    setNewConversationOpen(false);
                    setActiveConversation(conversation);

                    conversationService.loadUserConversations(currentUser.user.id);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        setNewConversationOpen(false);
    };

    const fetchConversations = () => {
        conversationService.listConversations(currentUser.user.id)
            .then((result) => {
                if (result.success) {
                    const items = result.Item;
                    if (items.length > 0) {
                        dispatch(setUserConversations(items));
                    }

                }
            })
    }

    return (
        <Grid
            sx={{
                padding: 0
            }}
        >

            {
                userConversations && userConversations !== {} && userConversations.length > 0 &&
                <List>
                    <Grid
                        padding={'0 2em 0 2em'}
                    >
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleNewConversationClick}
                            sx={{
                                color: 'white',
                                borderColor: 'white',

                                '&:hover': {
                                    color: 'black',
                                    background: 'white',
                                    borderColor: 'white'
                                }
                            }}
                        >New Conversation</Button>
                    </Grid>
                    {
                        userConversations.map((conversation) => (
                            <ConversationListItem
                                key={conversation.id}
                                conversation={conversation}
                                handleDeleteConversation={handleDeleteConversation}
                                showActions={true}
                            />
                        ))
                    }
                </List>
            }
            <NewConversationDialog
                open={newConversationOpen}
                onClose={handleNewConversationClose}
            />
        </Grid>
    )
}


