import React from 'react';

import { useState, useEffect } from 'react';

import { Grid, IconButton, TextField } from '@mui/material';

import { useSelector } from 'react-redux';

import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';

import speechRecognitionService from '../../services/speechRecognition';

import { ConversationService } from '../../data/services/conversationService';
import { FlowService } from '../../services/flowService';

import { TranscriptionStreamResponse, TranscriptionStreamEventTypes } from '../../services/response_objects/transcriptionStreamResponse';

export default function ChatInput(props) {
    const {
        onMessage,
        onMessageSend,
    } = props;

    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [disableMic, setDisableMic] = useState(false);
    const [conversationService, setConversationService] = useState(new ConversationService());
    const [currentFlow, setCurrentFlow] = useState({});

    const activeConversation = useSelector(state => state.conversations.activeConversation);
    const currentUser = useSelector(state => state.currentUser.user);
    const userFlows = useSelector(state => state.flows.userFlows);

    const flowService = new FlowService();

    useEffect(() => {
        if (activeConversation?.id) {
            userFlows.map(flow => {
                if (flow.id === activeConversation.flow_id) {
                    setCurrentFlow(flow);
                }
            });
        }
    }, [activeConversation?.id])


    let streamTranscript = '';

    let tempTranscript = '';
    let tempFinalIndex = 0;

    // Speech Recognition
    useEffect(() => {
        if (isRecording) {
            tempTranscript = input;
            tempFinalIndex = input.length;
            console.log('starting recognition')

            speechRecognitionService.initRecording(
                onSpeechMessage,
            );
        }
    }, [isRecording]);

    useEffect(() => {
        try {
            if (!isRecording) {
                if (speechRecognitionService) {
                    speechRecognitionService.stopRecording();
                }
            }
        } catch (e) {
            console.log(e);
        }
    }, [isRecording]);


    const onSpeechMessage = (message) => {
        const transcriptionStreamResponse = TranscriptionStreamResponse.fromJson(message);

        if (!transcriptionStreamResponse.client_id) {
            return;
        }

        const data = transcriptionStreamResponse.data;
        const text = data?.text;

        if (!text) {
            return;
        }

        const event = transcriptionStreamResponse.event;
        if (event === TranscriptionStreamEventTypes.TRANSCRIBE_STREAM_RECOGNIZING.description) {
            const data = transcriptionStreamResponse.data;
            const text = data?.text;

            if (text) {
                setInput(streamTranscript + ' ' + text);
            }
        } else if (event === TranscriptionStreamEventTypes.TRANSCRIBE_STREAM_RECOGNIZED.description) {
            const data = transcriptionStreamResponse.data;
            const text = data?.text;

            streamTranscript = streamTranscript + ' ' + text;
            setInput(streamTranscript);
        }
    }

    const onErrorCallback = (error) => {
        console.log('onErrorCallback', error);
        setIsRecording(false);
    }

    const handleSendClick = () => {
        console.log('clicker')
        if (input === '') return;

        const message = input;
        const chatMessage = {
            role: 'user',
            sender: currentUser.id,
            conversation_id: activeConversation.id,
            user: currentUser.username,
            user_id: currentUser.id,
            flow_id: currentFlow.id,
            message
        }

        onMessageSend(chatMessage);
        setInput('');
        flowService.runFlow(activeConversation.flow_id, chatMessage)
            .then((response) => {
                tempFinalIndex = 0;
                tempTranscript = '';
                conversationService.loadUserConversations(currentUser.id, activeConversation.id);
                onMessage();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            padding={'1em'}
        >
            {isRecording && <div>Recording...</div>}
            <TextField
                label="Message"
                InputLabelProps={{
                    sx: {
                        color: 'white'
                    }
                }}
                InputProps={{
                    sx: {
                        color: 'white'
                    }
                }}
                multiline
                maxRows={4}
                variant="filled"
                value={input}
                sx={{
                    flex: '10 1 auto',
                }}
                onChange={(e) => {
                    setInput(e.target.value)
                }}
            />
            <IconButton
                onClick={handleSendClick}
                flex={'1 10 auto'}
                sx={{
                    color: 'white',

                    '&:hover': {
                        color: 'black',
                        background: 'white',
                        transition: '0.2s ease-in-out'
                    },
                }}
            >
                <SendIcon
                    variant="contained"
                />
            </IconButton>
            <IconButton
                onClick={() => {
                    // setDisableMic(true);
                    setIsRecording(!isRecording)
                }}
                flex={'1 10 auto'}
                sx={{
                    color: 'white',

                    '&:hover': {
                        color: 'black',
                        background: 'white',
                        transition: '0.2s ease-in-out'
                    },
                }}
                disabled={disableMic}
            >
                <MicIcon
                    variant="contained"
                    color={'white'}
                />
            </IconButton>
        </Grid>
    )
}


