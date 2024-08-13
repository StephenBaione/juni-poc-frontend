import React from 'react';

import { useSelector } from 'react-redux';

import { List, Grid, Divider } from '@mui/material';

import ChatMessage from './ChatMessage';
import ConversationListItem from './ConversationListItem';

import { ConversationService } from '../../data/services/conversationService';

import theme from '../../Theme';

export default function ChatWindow(props) {
    const {
        messages
    } = props;

    const activeConversation = useSelector(state => state.conversations.activeConversation);

    const conversationService = new ConversationService();

    const textToSpeech = (message) => {
        conversationService.textToSpeech(message)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const deleteMessage = (message) => {
        conversationService.deleteMessage(activeConversation?.id, message)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <Grid
            container
            sx={{
                padding: 0,
            }}
        >
            {
                activeConversation &&
                <ConversationListItem
                    conversation={activeConversation}
                    showLastMessage={false}
                    showActions={false}
                    showAudioConversation={true}
                />
            }
            <Divider />
            {activeConversation &&
                <Grid
                    container
                    sx={{
                        padding: 0,
                    }}
                >
                    <Grid
                        sx={{
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            maxHeight: '70vh',
                            padding: '1em',
                            width: '100%',
                        }}
                    >

                        {messages && typeof messages[Symbol.iterator] === 'function' &&
                            [...messages].reverse().map((message, index) => (
                                <ChatMessage
                                    key={`chat-message-${index}`}
                                    message={message}
                                    handleTextToSpeech={textToSpeech}
                                    handleDeleteMessage={deleteMessage}
                                    sx={{
                                        background: theme.palette.chatWindow.background,
                                        borderRadius: '1em',
                                        padding: '1em',
                                        marginBottom: '1em'
                                    }}
                                />
                            ))}
                    </Grid>
                </Grid>
            }
        </Grid>
    )
}


