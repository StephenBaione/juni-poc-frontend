import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ChatMenu from './ChatMenu';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

import {
    Grid
} from '@mui/material';

import { setUserConversations } from '../../data/slices/conversations/conversationsSlice';
import { setAvailableAgentsConfig, setUserAgents } from '../../data/slices/agents/agentSlice';
import { setUserTemplates } from '../../data/slices/templates/templatesSlice';

import { useDispatch } from 'react-redux';

import { ConversationService } from '../../data/services/conversationService';

import { AgentService } from '../../services/agentService';
import { FlowService } from '../../services/flowService';
import { TemplateService } from '../../services/templateService';

const lodash = require('lodash');

export default function ChatScreen() {
    const config = useSelector(state => state.config.value);
    const showMenu = useSelector(state => state.display.showMenu);

    const currentUser = useSelector((state) => state.currentUser);

    const userFlows = useSelector(state => state.flows.userFlows);
    const activeConversationId = useSelector(state => state.conversations.activeConversation?.id);

    const conversationService = new ConversationService();
    const agentService = new AgentService();
    const templateService = new TemplateService();
    const flowService = new FlowService();

    const [messages, setMessages] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser?.user.id) {
            conversationService.listConversations(currentUser?.user?.id)
                .then((result) => {
                    if (result.success) {
                        const conversations = result.Item;

                        if (conversations !== {}) {
                            dispatch(setUserConversations(conversations));
                        }
                    }
                })

            agentService.loadUserAgents(currentUser?.user?.id)
                .then(result => console.log(result));

            agentService.getAvailableAgentsConfig()
                .then((result) => {
                    if (result.success) {
                        const config = result.Item;
                        console.log(config);
                        dispatch(setAvailableAgentsConfig(config));
                    }
                })

            templateService.listTemplates(currentUser?.user?.id)
                .then((result) => {
                    if (result.success) {
                        const templates = result.Item;
                        dispatch(setUserTemplates(templates))
                    }
                })

            // User empty .then to make sure that load function executes
            flowService.loadUserFlows(currentUser?.user?.id)
        }
    }, [])


    const fetchMessages = () => {
        conversationService.listMessages(activeConversationId)
            .then((result) => {
                if (result.success) {
                    const items = result.Item;
                    const sorted = lodash.sortBy(items, ["created_at"])
                    setMessages(sorted);
                }
            })
    }

    useEffect(() => {
        if (activeConversationId) {
            fetchMessages();
        }
    }, [activeConversationId])

    const onMessageSend = (message) => {
        const messageCopy = [...messages, message];
        setMessages(messageCopy);
    }

    const onMessage = () => {
        fetchMessages();
    }

    return (
        <Grid
            container
            direction="row"
            alignItems="stretch"
            padding={'1em'}
        >
            <Grid
                item
                xs={12}
                lg={4}
                md={4}
                sm={12}
            >
                {
                    showMenu && <ChatMenu />
                }
            </Grid>

            <Grid
                item
                xs={12}
                lg={showMenu ? 8 : 12}
                md={showMenu ? 8 : 12}
                sm={12}
                display={'flex'}
                flexDirection="column"
                justifyContent="space-between"
                alignItems="center"
                padding={'0 1em 0 1em'}
                minHeight={'80vh'}
                maxHeight={'80vh'}
            >
                <ChatWindow
                    messages={messages}
                />
                <ChatInput
                    onMessage={onMessage}
                    onMessageSend={onMessageSend}
                />
            </Grid>
        </Grid>
    )
}
