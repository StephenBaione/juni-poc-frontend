import React, { useState, useEffect } from 'react';

import {
    Button, Dialog, DialogContent, DialogTitle, Grid,
    Select, MenuItem, Typography
} from '@mui/material';

import SortableList from '../UI/sortableList';

import theme from '../../Theme';

const lodash = require('lodash');

export default function NodeCfgDialog(props) {
    const {
        open,
        handleClose,
        currentNodeId,
        edges,
        nodes,
        nodeCfg
    } = props;

    const [sortableProducerNodes, setSortableProducerNodes] = useState([]);
    const [newNodeConfig, setNewNodeConfig] = useState({});

    // Find the producer nodes for the current node id
    useEffect(() => {
        if (currentNodeId && open) {
            const foundProducerEdges = lodash.filter(edges, edge => edge.target === `${currentNodeId}`);

            let producerNodes = [];

            foundProducerEdges.forEach((edge) => {
                const foundNodes = lodash.filter(nodes, node => `${node.id}` === edge.source);
                producerNodes = [...producerNodes, ...foundNodes];
            });

            let sortableProducerNodes = [];
            if (nodeCfg?.Order === 'SortedOrder') {
                nodeCfg.SortedOrder.forEach((nodeId) => {
                    const node = lodash.find(producerNodes, producerNode => producerNode.id === nodeId);

                    sortableProducerNodes.push({
                        id: nodeId,
                        value: getNodeDescription(node),
                    })
                });
            } else {
                producerNodes.forEach((node) => {
                    sortableProducerNodes.push(
                        {
                            id: node.id,
                            value: getNodeDescription(node),
                        }
                    );
                })
            }

            setSortableProducerNodes(sortableProducerNodes);
            setNewNodeConfig(nodeCfg);
        }
    }, [open, nodeCfg]);

    const getNodeDescription = (nodeToDescribe) => {
        if (nodeToDescribe?.data.type === 'input') {
            return 'Input';
        } else if (nodeToDescribe?.data.type === 'agent') {
            return `${nodeToDescribe?.id} - ${nodeToDescribe?.data?.agent?.name}`
        } else {
            return 'Output';
        }
    }

    const onSortedOrderUpdate = (items) => {
        const cfgObject = {
            'Order': 'SortedOrder',
            'SortedOrder': items.map((item) => item.id)
        }

        if (newNodeConfig?.Order === 'SortedOrder') {
            setNewNodeConfig(cfgObject);
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent
                sx={{
                    backgroundColor: theme.palette.background.main,
                    backdropFilter: "blur(5px)",
                    overflow: 'clip'
                }}
            >
                <DialogTitle
                    sx={{
                        color: 'white'
                    }}
                >Node Settings</DialogTitle>
                {
                    newNodeConfig && !lodash.isEmpty(newNodeConfig) &&

                    <Grid
                        container
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Grid
                            item
                            container
                        >
                            <Typography
                                sx={{
                                    color: 'white'
                                }}
                            >Order</Typography>
                            <Select
                                sx={{
                                    color: 'white',
                                    border: 'solid 1px white',
                                }}
                                value={newNodeConfig?.Order}
                                label="Order By"
                                fullWidth
                                onChange={(e) => {
                                    const nodeCfgCopy = { ...newNodeConfig };
                                    nodeCfgCopy.Order = e.target.value;

                                    setNewNodeConfig(nodeCfgCopy);
                                }}
                            >
                                <MenuItem value={'FirstDone'}>
                                    First Done
                                </MenuItem>
                                <MenuItem value={'SortedOrder'}>
                                    Sorted Order
                                </MenuItem>
                            </Select>
                        </Grid>
                        {
                            newNodeConfig?.Order?.toLowerCase() === 'sortedorder' &&
                            <Grid
                                item
                                container
                                flexDirection={'column'}
                                sx={{
                                    transition: '0.2s ease-in-out'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'white'
                                    }}
                                >Order</Typography>
                                {
                                    sortableProducerNodes && !lodash.isEmpty(sortableProducerNodes) &&
                                    <SortableList
                                        defaultItems={sortableProducerNodes}
                                        onUpdate={onSortedOrderUpdate}
                                    />
                                }
                            </Grid>
                        }
                        <Grid
                            item
                            container
                            justifyContent={'center'}
                            alignItems={'center'}
                            padding={'1em 2em 1em 2em'}
                        >
                            <Button
                                sx={{
                                    color: 'white',
                                    border: 'solid white 1px',
                                    marginRight: '1em',

                                    '&:hover': {
                                        color: 'black',
                                        background: 'white',
                                        transition: '0.2s ease-in-out'
                                    }
                                }}
                                onClick={() => {
                                    handleClose({
                                        nodeId: `${currentNodeId}`,
                                        newNodeConfig,
                                    });

                                    setSortableProducerNodes([]);
                                    setNewNodeConfig({});
                                }}
                            >Apply</Button>
                            <Button
                                sx={{
                                    color: 'white',
                                    border: 'solid white 1px',

                                    '&:hover': {
                                        color: 'black',
                                        background: 'white',
                                        transition: '0.2s ease-in-out'
                                    }
                                }}
                                onClick={() => handleClose(null)}
                            >Cancel</Button>
                        </Grid>
                    </Grid>
                }
            </DialogContent>
        </Dialog >
    )
}
