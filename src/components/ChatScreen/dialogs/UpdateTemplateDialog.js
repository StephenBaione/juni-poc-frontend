import React, { useEffect, useState } from 'react';

import {
    Grid,
    Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
    TextField, Button, InputLabel, Select, MenuItem, Typography,
    Collapse, Divider,
    List, ListItemButton, ListItem, ListItemText, IconButton
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { InternalService } from '../../../data/services/internalService';

import { useSelector } from 'react-redux';

import SelectComponent from '../../misc/selectComponent';
import { current } from '@reduxjs/toolkit';

import theme from '../../../Theme';

export default function UpdateTemplateDialog(props) {
    const {
        onClose,
        open,
        currentTemplate
    } = props;

    const currentUser = useSelector((state) => state.currentUser)

    const [templateName, setTemplateName] = useState('');
    const [templateVersion, setTemplateVersion] = useState(0);
    const [tag, setTag] = useState('');
    const [template, setTemplate] = useState('');
    const [inputVariables, setInputVarilables] = useState([]);
    const [tempInputVariable, setTempInputVariable] = useState('');

    const [showInputVariables, setShowInputVariables] = useState(true);

    const handleSubmit = () => {
        const value = {
            templateName,
            templateVersion,
            tag,
            template,
            creator: currentUser.user.id,
            inputVariables
        };
        onClose(value);
    };

    useEffect(() => {
        setTemplateName(currentTemplate.template_name);
        setTemplateVersion(currentTemplate.template_version);
        setTag(currentTemplate.tag);
        setTemplate(currentTemplate.template);
        setInputVarilables(currentTemplate.input_variables);
    }, []);

    const handleClose = () => {
        onClose(null);
    };

    const handleAddInputVariable = (inputVariable) => {
        // Check if input variable is already in list
        if (inputVariable === '' || inputVariables.includes(inputVariable)) return;

        setInputVarilables([...inputVariables, inputVariable]);
    }

    const handleRemoveInputVariable = (inputVariable) => {
        const indexOfVar = inputVariables.indexOf(inputVariable);

        if (inputVariable == '' || indexOfVar === -1) return;

        let inputVars = [...inputVariables];
        inputVars.splice(indexOfVar, 1);
        
        setInputVarilables(inputVars)
    }

    const resetDialogValues = () => {
        setTemplateName('');
        setTemplateVersion(0);
        setTemplate('');
        setInputVarilables([]);
    };

    function TemplateInputVariables(props) {
        const templateVariables = props.templateVariables;

        return (
            <Grid
                container
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                width={'100%'}
            >
                <ListItemButton
                    sx={{
                        mr: 2,
                        color: 'black',
                        width: '100%',

                        "&:hover": {
                            background: theme.palette.background.secondary,
                            color: 'white'
                        }
                    }}
                    onClick={() => setShowInputVariables(!showInputVariables)}
                >Input Variables</ListItemButton>
                <Collapse
                    sx={{
                        width: '100%'
                    }}
                    in={showInputVariables}
                    timeout="auto"
                    unmountOnExit
                >
                    <Grid
                        container
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'flex-start'}
                    >
                        {
                            templateVariables.map((templateVariable) => (
                                <Grid
                                    item
                                    container
                                    flexDirection={'row'}
                                    justifyContent={'flex-start'}
                                    alignItems={'center'}
                                    sx={{
                                        border: 'solid black 1px',
                                        padding: '1em 0 1em 0'
                                    }}
                                >
                                    <IconButton
                                        color='black'
                                        sx={{
                                            padding: '0 1em 0 1em'
                                        }}
                                    >
                                        <RemoveIcon
                                            onClick={() => handleRemoveInputVariable(templateVariable)}
                                            variant="contained"
                                        />
                                    </IconButton>
                                    <Typography>{templateVariable}</Typography>
                                </ Grid>
                            ))
                        }
                    </Grid>
                </Collapse>
            </Grid >
        )
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Template</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Update Template
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Template Name"
                    fullWidth
                    variant="standard"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Template Version"
                    fullWidth
                    variant="standard"
                    type='number'
                    value={templateVersion}
                    onChange={(e) => setTemplateVersion(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Template Tag"
                    fullWidth
                    variant="standard"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />

                <Divider
                    height={'1em'}
                />

                <TemplateInputVariables
                    templateVariables={inputVariables}
                />

                <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}
                    width={'100%'}
                >
                    <TextField
                        margin='dense'
                        label='Add Template Variables'
                        fullWidth
                        variant='standard'
                        value={tempInputVariable}
                        onChange={(e) => setTempInputVariable(e.target.value)}
                    />
                    <IconButton
                        onClick={() => { handleAddInputVariable(tempInputVariable) }}
                    >
                        <AddIcon
                            variant="contained"
                        />
                    </IconButton>
                </Grid>

                <Divider
                    height={'1em'}
                />

                <TextField
                    multiline
                    rows={16}
                    margin="dense"
                    label="Template"
                    fullWidth
                    variant="standard"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}
