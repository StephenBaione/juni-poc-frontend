import React from 'react';

import {
    Avatar
} from '@mui/material';

export default function UserAvatar(props) {
    const {
        avatarUrl,
        size
    } = props;

    return (
        <Avatar
            alt="avatar"
            src={avatarUrl}
            sx={{ 
                width: size, 
                height: size, 
                "&:hover": {
                    opacity: 0.5,
                    cursor: 'pointer'
                },
               objectFit: 'cover'        
            }}
        />  
    )
}