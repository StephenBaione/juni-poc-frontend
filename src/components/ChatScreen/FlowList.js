import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { routeMap } from '../utils';

import {
    Grid,
    List,
    Button
} from '@mui/material';

import { useState } from 'react';

import { FlowService } from '../../services/flowService';

import FlowListItem from './FlowListItem';

export default function FlowList(props) {
    const currentUser = useSelector(state => state.currentUser);
    const userFlows = useSelector(state => state.flows.userFlows);
    console.log(userFlows);

    const {
        customContentStyle,
    } = props;

    const [newFlowOpen, setNewFlowOpen] = useState(false);

    const flowService = new FlowService();
    const dispatch = useDispatch();

    const fetchUserFlows = () => {
        flowService.loadUserFlows(currentUser?.user?.id);
    }

    const handleDeleteFlow = (flow_id) => {
        flowService.deleteFlow(
            flow_id
        ).then((success) => {
            if (success) {
                fetchUserFlows();
            }
        });
    }

    const navigate = useNavigate();

    const goToFlow = () => {
        return navigate(routeMap['flow']);
    }

    return (
        <Grid>
            <Grid
                padding={'0 2em 0 2em'}
            >
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => goToFlow()}
                    sx={{
                        color: 'white',
                        borderColor: 'white',

                        '&:hover': {
                            color: 'black',
                            background: 'white',
                            borderColor: 'white'
                        }
                    }}
                >New Flow</Button>
            </Grid>

            <List>
                {
                    userFlows.length > 0 &&
                    userFlows.map((flow) => (
                        <FlowListItem
                            key={`template-item-${flow.id}`}
                            flow={flow}
                            handleDeleteFlow={handleDeleteFlow}
                        />
                    ))
                }
            </List>
        </Grid>
    )
}


