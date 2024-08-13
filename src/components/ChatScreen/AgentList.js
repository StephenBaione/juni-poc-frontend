import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
    Grid,
    List,
    Button
} from '@mui/material';

import { useState } from 'react';

import { AgentService } from '../../services/agentService';

import AgentListItem from './AgentListItem';
import NewAgentDialog from './dialogs/NewAgentDialog';

export default function AgentList(props) {
    const currentUser = useSelector(state => state.currentUser);
    const userAgents = useSelector(state => state.agents.userAgents);
    console.log(userAgents);

    const {
        customContentStyle,
    } = props;

    const [newAgentOpen, setNewAgentOpen] = useState(false);

    const agentService = new AgentService();
    const dispatch = useDispatch();

    const fetchAgents = () => {
        agentService.loadUserAgents(currentUser?.user?.id)
            .then(result => console.log(result));
    }

    const handleNewAgentClick = () => {
        setNewAgentOpen(true);
    };

    const handleDeleteAgent = (owner, name) => {
        agentService.deleteAgent(
            owner,
            name
        ).then((result) => {
            if (result.success) {
                fetchAgents();
            }
        });

    }

    const handleNewAgentClose = (value) => {
        if (value !== null) {
            agentService.createAgent(value)
                .then((result) => {
                    if (result === null) {
                        alert('Error creating agent.')
                    }

                    fetchAgents();
                    setNewAgentOpen(false);
                })
        }

        setNewAgentOpen(false);
    };

    return (
        <Grid
        >
            <List>
                <Grid
                    sx={{
                        padding: '0 2em 0 2em'
                    }}
                >
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleNewAgentClick}
                        sx={{
                            color: 'white',
                            borderColor: 'white',

                            '&:hover': {
                                color: 'black',
                                background: 'white',
                                borderColor: 'white'
                            }
                        }}
                    >New Agent</Button>
                </Grid>
                {
                    userAgents.length > 0 &&
                    userAgents.map((agent) => (
                        <AgentListItem
                            key={`template-item-${agent.id}`}
                            agent={agent}
                            handleDeleteAgent={handleDeleteAgent}
                        />
                    ))
                }
            </List>
            <NewAgentDialog
                open={newAgentOpen}
                onClose={handleNewAgentClose}
            />
        </Grid>
    )
}


