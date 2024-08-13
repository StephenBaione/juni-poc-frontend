import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
    Grid,
    List, ListItem, ListItemText,
    Card, CardHeader, CardContent,
    Button
} from '@mui/material';

import ConversationListItem from './ConversationListItem';

import { addConversation } from '../../data/slices/conversations/conversationsSlice';

import NewTemplateDialog from './dialogs/NewTemplateDialog';

import { useState } from 'react';

import { TemplateService } from '../../services/templateService';

import TemplateListItem from './TemplateListItem';
import { setUserTemplates } from '../../data/slices/templates/templatesSlice';

export default function TemplateList(props) {
    const currentUser = useSelector(state => state.currentUser);
    const templates = useSelector(state => state.templates.userTemplates);

    const {
        customContentStyle,
    } = props;

    const dispatch = useDispatch();

    const [newTemplateOpen, setNewTemplateOpen] = useState(false);

    const templateService = new TemplateService();

    const fetchTemplates = () => {
        templateService.loadTemplates(currentUser.user.id)
            .then((result) => {
                console.log(result);
            })
    }

    const handleNewTemplateClick = () => {
        setNewTemplateOpen(true);
    };

    const handleDeleteTemplate = (template_name, template_version) => {
        templateService.deleteTemplate(
            template_name,
            template_version
        ).then((result) => {
            if (result.success) {
                fetchTemplates();
            }
        });

    }

    const handleNewTemplateClose = (value) => {
        if (value !== null) {
            templateService.createTemplate(value)
                .then((result) => {
                    if (result === null) {
                        alert('Error creating template.')
                    }

                    fetchTemplates();
                    setNewTemplateOpen(false);
                })
        }

        setNewTemplateOpen(false);
    };

    return (
        <Grid>
            <List>
                <Grid
                    padding={'0 2em 0 2em'}
                >
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleNewTemplateClick}
                        sx={{
                            color: 'white',
                            borderColor: 'white',

                            '&:hover': {
                                color: 'black',
                                background: 'white',
                                borderColor: 'white'
                            }
                        }}
                    >New Template</Button>
                </Grid>
                {
                    templates && templates.length > 0 &&
                    templates.map((template) => (
                        <TemplateListItem
                            key={`template-item-${template.id}`}
                            template={template}
                            handleDeleteTemplate={handleDeleteTemplate}
                        />
                    ))
                }
            </List>
            <NewTemplateDialog
                open={newTemplateOpen}
                onClose={handleNewTemplateClose}
            />
        </Grid>
    )
}


