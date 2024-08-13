import React, { useState } from 'react';

import {
    ListItem, ListItemText, ListItemAvatar, Avatar,
    Typography, Grid, IconButton, ListItemButton, ListItemIcon
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import { useSelector, useDispatch } from 'react-redux';
import { setActiveFlow } from '../../data/slices/flows/flowsSlice';

import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

import { useNavigate } from 'react-router-dom';
import { routeMap } from '../utils';

import theme from '../../Theme';

export default function FlowListItem(props) {
    const {
        flow,
        handleDeleteFlow
    } = props;

    const currentUser = useSelector(state => state.currentUser?.user);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const goToFlow = () => {
        const route = `${routeMap['flow']}/${flow.id}`;
        return navigate(route);
    }

    // const [updateAgentOpen, setUpdateAgentOpen] = useState(false);
    // const agentService = new AgentService();

    const showActions = props.showActions !== undefined ? props.showActions : true;

    // const dispatch = useDispatch();
    const handleDeleteClick = () => {
        handleDeleteFlow(flow.id);
    }

    const handleActiveFlowClick = () => {
        dispatch(setActiveFlow(flow));
    }

    const secondaryActions = () => {
        if (showActions) {
            return (
                <Grid
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <IconButton
                        sx={{
                            color: 'white',
                            marginLeft: '1em',

                            '&:hover': {
                                color: 'black',
                                background: 'white',
                                transition: '0.2s ease-in-out',
                            },
                        }}
                        onClick={handleActiveFlowClick}
                    >
                        <ElectricBoltIcon />
                    </IconButton>
                    <IconButton
                        sx={{
                            color: 'white',
                            
                            '&:hover': {
                                color: 'black',
                                background: 'white',
                                transition: '0.2s ease-in-out',
                            },
                        }}
                        edge="end"
                        aria-label="delete"
                        onClick={handleDeleteClick}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Grid>
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
                    width={'75%'}
                    onClick={() => { return goToFlow() }}
                >
                    <ListItemText
                        primary={`${flow.id}`}
                        primaryTypographyProps={{
                            color: 'white',
                            textOverflow: 'ellipsis'
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
                    onClick={() => { goToFlow() }}
                >
                    <ListItemIcon>
                        <ElectricBoltIcon edge='start' />
                    </ListItemIcon>
                    <ListItemText
                        primary={`${flow.id}`}
                        // secondary={`${flow.service}`}
                        secondaryTypographyProps={{
                            style: {
                                color: theme.palette.ListItem.secondary,
                            }
                        }}
                    />
                </ListItemButton>
            }
        </ListItem>
    )
}
