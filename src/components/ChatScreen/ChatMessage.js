import React from 'react';

import { useSelector } from 'react-redux';

import { Grid, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, CircularProgress, Typography } from '@mui/material';

import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import DeleteIcon from '@mui/icons-material/Delete';

import MarkDown from '../UI/markDown';

export default function ChatMessage(props) {
  const {
    message,
    handleTextToSpeech,
    handleDeleteMessage,
    sx
  } = props;

  const [loadingAudio, setLoadingAudio] = React.useState(false);

  return (
    <Grid
      container
      sx={sx ? sx : null}
      borderRadius={'0.5em'}
    >
      <Grid
        item
        container
        sx={{
          color: 'white'
        }}
        justifyContent={'space-between'}
        alignItems={'flex-start'}
        paddingRight={'1em'}
      >
        <Grid
          item
          container
          justifyContent={'flex-start'}
          alignItems={'center'}
          color={'white'}
          lg={6}
          md={6}
          sm={6}
          xs={6}
        >
          <ListItemAvatar>
            <Avatar alt={message.author} src={message.authorAvatar} />
          </ListItemAvatar>
          <Typography>{message.role === 'user' ? message.user : message.sender}</Typography>
        </Grid>
        <Grid
          item
          container
          flexDirection={'row'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          lg={6}
          md={6}
          sm={6}
          xs={6}
          paddingRight={'0.5em'}
        >
          <Grid
            item
            paddingRight={'1em'}
          >
            <IconButton
              sx={{
                color: 'white',

                '&:hover': {
                  background: 'white',
                  color: 'black',
                  transition: '0.2s ease-in-out'
                }
              }}
              edge="end"
              aria-label="record"
              onClick={() => {
                setLoadingAudio(true);
                handleTextToSpeech(message.message)
                setLoadingAudio(false);
              }}
            >
              <RecordVoiceOverIcon />
            </IconButton>
          </Grid>
          <Grid
            item
          >
            <IconButton
              sx={{
                color: 'white',

                '&:hover': {
                  color: 'black',
                  background: 'white',
                  transition: '0.2s ease-in-out'
                }
              }}
              edge="end"
              aria-label="record"
              onClick={() => {
                handleDeleteMessage(message);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
          {/* {loadingAudio &&
            <CircularProgress
              sx={{
                position: 'absolute',
              }}
            />
          } */}
        </Grid>
      </Grid>
      <Grid
        item
        container
        sx={{
          paddingRight: '1em',
        }}
      >
        <Grid
          item
          container
          flexDirection={'column'}
          overflow={'auto'}
          color={'white'}
          sx={{
            '& pre': {
              maxWidth: '100%',
              fontSize: 'x-small',
              '@media (min-width: 500px)': {
                fontSize: 'x-small'
              },
              '@media (min-width: 780px)': {
                fontSize: 'small'
              }
            }
          }}
        >
          <MarkDown
            content={message.message}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}


