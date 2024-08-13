import React, { useCallback, useEffect, useState, useRef } from 'react';

import { useSelector } from 'react-redux';

import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from 'reactflow';

import { FlowNode } from '../../data/models/flowNode';

import 'reactflow/dist/style.css';
import {
    Button, Grid, Stack,
    Card, CardContent,
    Typography,
    IconButton, TextField,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';

import { useParams } from 'react-router-dom';

import AddNodeDialog from './addNodeDialog';
import AddInputDialog from './addInputDialog';
import AddOutputDialog from './addOutputDialog';

import NodeCfgDialog from './nodeCfgDialog';

import { FlowService } from '../../services/flowService';

import { useNavigate } from 'react-router-dom';

import { routeMap } from '../utils';

import theme from '../../Theme';

const lodash = require('lodash');

export default function FlowBuilder(props) {
    const {
        existing
    } = props;

    const { flow_id } = useParams();
    console.log(flow_id)

    const navigate = useNavigate();

    const flowService = new FlowService();

    const [flowAvailabilityConfig, setFlowAvailabilityConfig] = useState({});

    const currentUser = useSelector(state => state.currentUser.user);

    useEffect(() => {
        flowService.get_availability_config()
            .then((response) => {
                if (response.success) {
                    setFlowAvailabilityConfig(response.Item);
                }
            })
    }, [flow_id]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [nextNodeId, setNextNodeId] = useState(0);
    const [currentNode, setCurrentNode] = useState(null);
    const [currentNodeCfg, setCurrentNodeCfg] = useState(null);
    
    const [openNodeCfg, setOpenNodeCfg] = useState(false);
    const [openAddFlow, setOpenAddFlow] = useState(false);
    const [openAddInput, setOpenAddInput] = useState(false);
    const [openAddOutput, setOpenAddOutput] = useState(false);

    const [flowName, setFlowName] = useState(null);
    const [editFlowName, setEditFlowName] = useState(false);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const availableAgents = useSelector(state => state.agents.availableAgentsConfig.AvailableAgents);

    function BuildAgentNode(buildProps) {
        const {
            agent,
            agentNodeId,
        } = buildProps;

        return (
            <Stack
                direction={'row'}
            >
                <Typography 
                    variant="body2"
                    sx={{
                        whiteSpace: 'pre-line',
                        width: '70%',
                        textAlign: 'left',
                        fontWeight: 'bold'
                    }}
                >{agentNodeId + '\n' + agent.name + '\n' + agent.type + '\n' + agent.service}</Typography>
                <Grid>
                    <IconButton
                        size='small'
                        sx={{
                            '&:hover': {
                                background: 'black',
                                color: 'white',
                                transition: '0.2s ease-in-out'
                            }
                        }}
                        onClick={() => {
                            setCurrentNode(agentNodeId);
                            setOpenNodeCfg(true);
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Grid>
            </Stack >
        )
    }

    const handleNodeCfgClose = (data) => {
        if (data === null) {
            setOpenNodeCfg(false);
            return;
        }

        const nodeId = data.nodeId;
        const newNodeConfig = data.newNodeConfig;

        // Copy nodes to trigger automatic update
        let nodesCopy = [...nodes];

        // Find node that matches id
        const nodeIndex = lodash.findIndex(nodesCopy, (node) => node.id === nodeId);

        // Set cfg field for node item
        let nodeItemCopy = nodesCopy[nodeIndex];
        nodeItemCopy.data.cfg = newNodeConfig;
        nodesCopy[nodeIndex] = nodeItemCopy;

        // Update state variables
        setNodes(nodesCopy);
        setOpenNodeCfg(false);
        setCurrentNode(null);
        setCurrentNodeCfg(null);
    }

    const handleAddAgentClose = (agent) => {
        if (!agent) {
            setOpenAddFlow(false);
            return;
        }

        const metaData = {
            label: BuildAgentNode({ agent, agentNodeId: nextNodeId }),
            type: 'agent',
            agent,
            cfg: {
                'Order': 'FirstDone'
            },
        }
        const flowNode = new FlowNode(`${nextNodeId}`, { x: 0, y: 0 }, metaData)
        handleAddFlowNode(flowNode);
        setOpenAddFlow(false);

        setNextNodeId(nextNodeId + 1);
    }

    const handleAddInputClose = (value) => {
        if (value === null || value === '') {
            setOpenAddInput(false);
            return;
        }

        const flowNode = new FlowNode(`${nextNodeId}`, { x: 0, y: 0 }, { label: value, type: 'input' })
        handleAddFlowNode(flowNode);
        setOpenAddInput(false);

        setNextNodeId(nextNodeId + 1);
    }

    const handleAddOutputClose = (value) => {
        if (value === null || value === '') {
            setOpenAddOutput(false);
            return;
        }

        const flowNode = new FlowNode(`${nextNodeId}`, { x: 0, y: 0 }, { label: value, type: 'output' })
        handleAddFlowNode(flowNode);
        setOpenAddOutput(false);

        setNextNodeId(nextNodeId + 1);
    }

    const handleAddFlowNode = (node) => {
        let nodeCopy = [...nodes];
        nodeCopy.push(node.toJson())
        setNodes(nodeCopy)
        console.log(nodeCopy, edges);
    }

    const handleSaveFlowTemplate = () => {
        flowService.saveFlow(nodes, edges, currentUser.id, flow_id)
            .then(result => {
                if (result.success && result.Item !== {}) {
                    return navigate(`${routeMap['flow']}/${result.Item.id}`)
                }
                console.log(result)
            });
    }

    const handleSetFlowName = () => {
        flowService.setFlowName(flow_id, flowName)
            .then(success => {
                if (success) {
                    fetchFlow();
                }
            })
    }

    const fetchFlow = () => {
        flowService
            .getFlow(flow_id)
            .then(flow => {
                if (flow && flow !== {}) {
                    console.log(flow);
                    const nodes = flow.Nodes;

                    const nodeIds = Object.entries(nodes).map((nodeData, _) => nodeData[1].id)
                    const nextId = Math.max(...nodeIds) + 1;
                    setNextNodeId(nextId);

                    nodes.map((node) => {
                        if (node.data.type === 'agent') {
                            node.data.label = BuildAgentNode(
                                {
                                    agent: node.data.agent,
                                    agentNodeId: node.id,
                                }
                            );
                        }
                    });
                    setNodes(nodes);
                    setEdges(flow.Edges);

                    if (flow.name) {
                        setFlowName(flow.name);
                    }
                }
            });
    }

    useEffect(() => {
        if (existing) {
            fetchFlow();
        } else {
            setNodes([]);
            setEdges([]);
        }
    }, [existing]);

    useEffect(() => {
        if (currentNode) {
            const nodeCfg = lodash.find(nodes, (node) => node.id === `${currentNode}`)?.data?.cfg;
            setCurrentNodeCfg({...nodeCfg});
        }
    }, [currentNode]);

    return (
        <div style={{ width: '100vw', height: '65vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
                {
                    currentNode &&
                    <NodeCfgDialog
                        open={openNodeCfg}
                        handleClose={handleNodeCfgClose}
                        currentNodeId={currentNode}
                        edges={edges}
                        nodes={nodes}
                        nodeCfg={currentNodeCfg}
                    />
                }
            </ReactFlow>
            <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                padding={'2em'}
            >
                <Card>
                    <CardContent>
                        <Grid
                            container
                            flexDirection={'row'}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            {
                                !editFlowName &&
                                <Typography>{flowName ? flowName : flow_id}</Typography>
                            }
                            {
                                editFlowName &&
                                <TextField
                                    label="Flow Name:"
                                    variant='outlined'
                                    sx={{
                                        width: '100%'
                                    }}
                                    inputProps={{
                                        style: {
                                            padding: '1em',
                                            width: '100%'
                                        }
                                    }}
                                    value={flowName}
                                    onChange={(e) => setFlowName(e.target.value)}
                                />
                            }
                            <IconButton
                                onClick={() => {
                                    if (editFlowName) {
                                        handleSetFlowName();
                                    }
                                    setEditFlowName(!editFlowName)
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Grid>
                        <Grid
                            container
                            item
                            justifyContent={'center'}
                            alignItems={'center'}
                            padding={'2em'}
                        >
                            <Button
                                sx={{
                                    background: theme.palette.flowBuilder.buttonBackground,
                                    color: 'white',
                                    marginRight: '1em',

                                    '&:hover': {
                                        color: 'black'
                                    }
                                }}
                                size='large'
                                onClick={() => handleSaveFlowTemplate()}
                            >Save Flow</Button>

                            <AddNodeDialog
                                open={openAddFlow}
                                onClose={handleAddAgentClose}
                            />
                            <Button
                                sx={{
                                    background: theme.palette.flowBuilder.buttonBackground,
                                    color: 'white',
                                    marginRight: '1em',

                                    '&:hover': {
                                        color: 'black'
                                    }
                                }}
                                size='large'
                                onClick={() => setOpenAddFlow(true)}
                            >Add Agent</Button>

                            <AddInputDialog
                                open={openAddInput}
                                onClose={handleAddInputClose}
                                flowAvailabilityConfig={flowAvailabilityConfig}
                            />
                            <Button
                                sx={{
                                    background: theme.palette.flowBuilder.buttonBackground,
                                    color: 'white',
                                    marginRight: '1em',

                                    '&:hover': {
                                        color: 'black'
                                    }
                                }}
                                size='large'
                                onClick={() => setOpenAddInput(true)}
                            >Add Input</Button>

                            <AddOutputDialog
                                open={openAddOutput}
                                onClose={handleAddOutputClose}
                                flowAvailabilityConfig={flowAvailabilityConfig}
                            />
                            <Button
                                sx={{
                                    background: theme.palette.flowBuilder.buttonBackground,
                                    color: 'white',
                                    marginRight: '1em',

                                    '&:hover': {
                                        color: 'black'
                                    }
                                }}
                                size='large'
                                onClick={() => setOpenAddOutput(true)}
                            >Add Output</Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    );
}