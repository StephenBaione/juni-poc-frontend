import React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListItem, ListItemText, IconButton } from '@mui/material';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export default function SortableListItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <ListItem ref={setNodeRef} style={style}>
            <ListItemText
                sx={{
                    color: 'white'
                }}
            >
                {props.value}
            </ListItemText>
            <IconButton 
                sx={{ 
                    color: 'white',
                    
                    '&:hover': {
                        background: 'white',
                        color: 'black',
                        transition: '0.2s ease-in-out'
                    }
                }}
                {...attributes} 
                {...listeners}>
                <DragIndicatorIcon />
            </IconButton>
        </ListItem>
    )
}
