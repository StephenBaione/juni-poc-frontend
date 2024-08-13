//import { Suspense, useState, useRef } from "react";
import * as React from 'react';

import { useSelector } from "react-redux";

import {
    Button, Grid,
    Card, CardContent, Paper,
    Typography,
    IconButton, TextField,
    Container,
    Avatar,
    Box, Divider,
    ToggleButton, ToggleButtonGroup,
    List, ListItem, ListItemText,
    TableContainer, Table, TableBody, TableCell, TableRow,
    Fragment
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import LockIcon from '@mui/icons-material/Lock';

import { InternalApi } from "./../../services/internalApi";

import store from "../../data/store";

import UserService from '../../services/userService';

import UserAvatar from '../UI/UserAvatar';
import UserStatCard from './UserStatCard';

import theme from '../../Theme';

export default function ProfileScreen() {
    const userService = new UserService();

    // file upload input ref
    const uploadInputRef = React.useRef(null); 

    // get user details
    const currentUser = useSelector(state => state.currentUser);
    const userId = currentUser?.user?.id;
    const username = currentUser?.user?.username;
    const email = currentUser?.user?.email;
    var avatarUrl = currentUser?.user?.avatar_url;

    // fetch templates and get the count
    const userTemplates = useSelector(state => state.templates.userTemplates);
    const userTemplateCount = userTemplates?.length || 0;

    // fetch flows and get the count
    const userFlows = useSelector(state => state.flows.userFlows);
    const userFlowCount = userFlows?.length || 0;

    // fetch conversations and get the count
    const userConversations = useSelector(state => state.conversations);
    const userConversationCount = userConversations?.length || 0;

    // assemble the user stats
    const userStats = [
        {
            name: 'Templates',
            count: userTemplateCount
        },
        {
            name: 'Flows',
            count: userFlowCount
        },
        {
            name: 'Conversations',
            count: userConversationCount
        }
    ];

    // view changes based on left nav
    const views = {
        'accountOverview': {
            title: 'Account Overview',
            details: {
                'Username': username,
                'Email': email,
            }
        },
        'securitySettings': {
            title: 'Security Settings',
            details: {
                'Password': '********'
            }
        }
    }

    const defaultView = 'accountOverview';

    const [view, setView] = React.useState(defaultView);
    const [viewData, setViewData] = React.useState(views[defaultView]);

    // handle view changes
    const handleChange = (event, nextView) => {
        setView(nextView);
        setViewData(views[nextView])
    };
    
    // handle user changing avatar image
    async function onAvatarChange(e) {
        // get the uploaded file
        const file = uploadInputRef.current.files[0]

        // upload the file and update the users avatar url
        const result = await userService.updateUserAvatarUrl(userId, file)
    }

    return (
        <Grid sx={{ color: 'white', padding: '1em 4em 0 4em' }}>
            <Grid
                container
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                padding={'1em 2em 0 2em'}
            >
                
                <Grid
                    container
                    flexDirection={'row'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    width={'100%'}
                    paddingLeft={'2em'}
                >
                  
                    <IconButton
                        onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
                        variant="contained"
                    >
                        <UserAvatar avatarUrl={avatarUrl} size={150}/>
                        <input
                            ref={uploadInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={onAvatarChange}
                        />
                    </IconButton>
                    
                    <Grid
                        item
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingLeft: '1em'
                        }}>
                        <Typography variant='h3'> {username} </Typography>
                        <Typography variant='h6'> {email} </Typography>
                    </Grid>


                </Grid>

            </Grid>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                pt: 5,
            }}>
                {userStats.map((stat) => (
                    <UserStatCard name={stat.name} count={stat.count} />
                ))}
            </Box>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                pt: 5,
                height: '45vh',
                borderRadius: '0.5em',
                paddingLeft: '4em',
                paddingRight: '4em'
            }}>
                <Box sx={{
                    backgroundColor: theme.palette.background.secondary,
                    width: '33%',
                    borderRadius: '0.5em 0 0 0.5em',
                }}>
                    <ToggleButtonGroup
                        orientation="vertical"
                        value={view}
                        exclusive
                        onChange={handleChange}
                        sx={{ width: '100%' }}
                        color="primary"
                    >
                        <ToggleButton value="accountOverview" aria-label="accountOverview">
                            <HomeIcon sx={{ color: 'white' }} /><Typography sx={{ color: 'white' }}>Account Overview</Typography>
                        </ToggleButton>
                        <ToggleButton value="securitySettings" aria-label="securitySettings">
                            <LockIcon sx={{ color: 'white' }} /><Typography sx={{ color: 'white' }}>Security Settings</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{
                    backgroundColor: 'white',
                    width: '67%',
                    color: 'black',
                    borderRadius: '0 0.5em 0.5em 0'
                }}>
                    <Typography sx={{ p: 2 }} variant='h4'>{viewData.title}</Typography>
                    <TableContainer sx={{ pt: 2 }}>
                        <Table aria-label="simple table">
                            {Object.keys(viewData.details).map((key, value) => (
                                <TableBody
                                    key={key}
                                >
                                    <TableRow>
                                        <TableCell sx={{ pt: 1 }}>{key}</TableCell>
                                        <TableCell><strong>{viewData.details[key]}</strong></TableCell>
                                    </TableRow>
                                </TableBody>
                            ))}
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            
        </Grid>
    );
}