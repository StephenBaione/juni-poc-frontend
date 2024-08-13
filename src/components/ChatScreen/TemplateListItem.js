import React, { useState } from 'react';

import {
    ListItem, ListItemText, ListItemAvatar, Avatar,
    Typography, Grid, IconButton, ListItemButton, ListItemIcon
} from '@mui/material';

import StickyNote2Icon from '@mui/icons-material/StickyNote2';

import DeleteIcon from '@mui/icons-material/Delete';
import MicIcon from "@mui/icons-material/Mic";

import UpdateTemplateDialog from './dialogs/UpdateTemplateDialog';

import { useSelector, useDispatch } from 'react-redux';
import { removeConversation, setActiveConversation } from '../../data/slices/conversations/conversationsSlice';

import { TemplateService } from '../../services/templateService';

import theme from '../../Theme';

export default function TemplateListItem(props) {
    const {
        template,
        handleDeleteTemplate
    } = props;

    const [updateTemplateOpen, setUpdateTemplateOpen] = useState(false);

    const templateService = new TemplateService();

    console.log(template);

    const showActions = props.showActions !== undefined ? props.showActions : true;

    const dispatch = useDispatch();
    const handleDeleteClick = () => {
        handleDeleteTemplate(template.template_name, template.template_version);
    }

    const handleUpdateTemplateClose = (value) => {
        if (value !== null) {
            templateService.updateTemplate(value)
            .then((result) => {
                if (result === null) {
                    alert('Error creating template.')
                }

                setUpdateTemplateOpen(false);
            })
        }

        setUpdateTemplateOpen(false);
    };

    const secondaryActions = () => {
        if (showActions) {
            return (
                <IconButton
                    sx={{
                        color: 'white',

                        '&:hover': {
                            color: 'black',
                            background: 'white',
                            transition: '0.2s ease-in-out',
                        }
                    }}
                    edge="end"
                    aria-label="delete"
                    onClick={handleDeleteClick}
                >
                    <DeleteIcon />
                </IconButton>
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
                    onClick={() => { setUpdateTemplateOpen(!updateTemplateOpen) }}
                >
                    <ListItemIcon
                        sx={{
                            color: 'white'
                        }}
                    >
                        <StickyNote2Icon edge='start' />
                    </ListItemIcon>
                    <ListItemText
                        primary={`${template.template_name} - ${template.template_version}`}
                        primaryTypographyProps={{
                            color: 'white'
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
                    onClick={() => { setUpdateTemplateOpen(!updateTemplateOpen) }}
                >
                    <ListItemIcon>
                        <StickyNote2Icon edge='start' />
                    </ListItemIcon>
                    <ListItemText
                        primary={`${template.template_name} - ${template.template_version}`}
                        secondaryTypographyProps={{
                            style: {
                                color: theme.palette.ListItem.textSecondary,
                            }
                        }}
                    />
                </ListItemButton>
            }

            <UpdateTemplateDialog
                open={updateTemplateOpen}
                onClose={handleUpdateTemplateClose}
                currentTemplate={template}
            />
        </ListItem>
    )
}
