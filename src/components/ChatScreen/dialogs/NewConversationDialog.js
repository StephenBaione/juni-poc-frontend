import React, { useState } from 'react';

import {
  Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
  TextField, Button, InputLabel, Select, MenuItem, Typography
} from '@mui/material';

import { useSelector } from 'react-redux';

export default function NewConversationDialog(props) {
  const {
    onClose,
    open,
  } = props;
  const currentUser = useSelector((state) => state.currentUser);
  const userFlows = useSelector(state => state.flows.userFlows);

  const [nickName, setNickName] = useState('');
  const [chosenFlow, setChosenFlow] = useState('');

  const handleSubmit = () => {
    const value = {
      nickname: nickName,
      flow_id: chosenFlow,
      user_id: currentUser.user.id,
    };
    onClose(value);
  };

  const handleClose = () => {
    onClose(null);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Conversation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          New Conversation
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Nickname"
          fullWidth
          variant="standard"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
        />

        <Typography>Flow</Typography>
        <Select
          sx={{
            margin: '1em 0 1em 0'
          }}
          value={chosenFlow}
          fullWidth
          onChange={(e) => {
            setChosenFlow(e.target.value)
          }}
        >
          {
            userFlows.length > 0 &&
            userFlows.map((flow) => (
              <MenuItem value={flow.id}>
                {flow.name ? flow.name : flow.id}
              </MenuItem>
            ))
          }
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}
