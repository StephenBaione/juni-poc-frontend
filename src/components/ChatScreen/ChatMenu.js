import React, { useState } from 'react'

import ConversationList from "./ConversationList";
import TemplateList from "./TemplateList";
import AgentList from './AgentList';
import FlowList from './FlowList';

import {
    List,
    Card, CardContent, IconButton,
} from "@mui/material";

import Collapsible from '../UI/collapsible';

import TerminalIcon from "@mui/icons-material/Terminal";


export default function ChatMenu(props) {
    const {
        customStyling
    } = props;

    const [showConversation, setShowConversation] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showAgents, setShowAgents] = useState(false);
    const [showFlows, setShowFlows] = useState(false);
    const [showFiles, setShowFiles] = useState(false);

    return (
        <Card
            sx={{
                minWidth: '33%',
                maxHeight: '80vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 0,
                backgroundColor: "transparent",
                backdropFilter: "blur(5px)",
                border: null,
                boxShadow: 0
            }}
        >
            <CardContent
                sx={{
                    padding: 0
                }}
            >
                <List
                    sx={{
                        padding: 0
                    }}
                >
                    {/* FLOWS */}
                    <Collapsible
                        embeddedComponent={
                            <FlowList
                                customContentStyle={{
                                    maxHeight: '60vh',
                                    overflow: 'auto'
                                }}
                            />
                        }
                        action={
                            <IconButton
                                sx={{
                                    color: 'white',
                                    marginRight: '1em',
                                    zIndex: '2000',

                                    "&:hover": {
                                        color: 'black',
                                        background: 'white',
                                        transition: '0.2s ease-in-out'
                                    }
                                }}

                                // onClick={onConsoleClick}
                            >
                                <TerminalIcon />
                            </IconButton>
                        }
                        title={'Flows'}
                        onClick={() => setShowFlows(!showFlows)}
                    >
                    </Collapsible>

                    {/* Sessions */}
                    <Collapsible
                        embeddedComponent={
                            <ConversationList
                                customContentStyle={{
                                    maxHeight: '60vh',
                                    overflow: 'auto'
                                }}
                                showActions={true}
                            />
                        }
                        action={
                            <IconButton
                                sx={{
                                    color: 'white',
                                    marginRight: '1em',

                                    "&:hover": {
                                        color: 'black',
                                        background: 'white',
                                        transition: '0.2s ease-in-out'
                                    }
                                }}
                            >
                                <TerminalIcon />
                            </IconButton>
                        }
                        title={'Conversations'}
                        onClick={() => setShowConversation(!showConversation)}
                    >
                    </Collapsible>

                    {/* Agents */}
                    <Collapsible
                        embeddedComponent={
                            <AgentList
                                customContentStyle={{
                                    maxHeight: '60vh',
                                    overflow: 'auto'
                                }}
                                showActions={true}
                            />
                        }
                        action={
                            <IconButton
                                sx={{
                                    color: 'white',
                                    marginRight: '1em',

                                    "&:hover": {
                                        color: 'black',
                                        background: 'white',
                                        transition: '0.2s ease-in-out'
                                    }
                                }}
                            >
                                <TerminalIcon />
                            </IconButton>
                        }
                        title={'Agents'}
                        onClick={() => setShowAgents(!showAgents)}
                    >
                    </Collapsible>

                    {/* Templates */}
                    <Collapsible
                        last
                        embeddedComponent={
                            <TemplateList
                                customContentStyle={{
                                    maxHeight: '60vh',
                                    overflow: 'auto'
                                }}
                                showActions={true}
                            />
                        }
                        action={
                            <IconButton
                                sx={{
                                    color: 'white',
                                    marginRight: '1em',

                                    "&:hover": {
                                        color: 'black',
                                        background: 'white',
                                        transition: '0.2s ease-in-out'
                                    }
                                }}
                            >
                                <TerminalIcon />
                            </IconButton>
                        }
                        title={'Templates'}
                        onClick={() => setShowTemplates(!showTemplates)}
                    >
                    </Collapsible>


                </List>
            </CardContent>
        </Card>
    )
}


