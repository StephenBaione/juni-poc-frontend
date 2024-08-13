import React, { useState } from 'react'

import {
  Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
  TextField, Button, Typography, Select, MenuItem
} from "@mui/material";
import { useSelector } from 'react-redux';

export default function AddNodeDialog(props) {
  const {
    onClose,
    open
  } = props;
  const [selectedAgent, setSelectedAgent] = useState('');

  const userAgents = useSelector(state => state.agents.userAgents);

  const handleClose = () => {
    onClose(null);
  }

  const handleSubmit = () => {
    onClose(selectedAgent);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Agent</DialogTitle>
      <DialogContent>
        <DialogContentText>
          New Agent
        </DialogContentText>
        <Typography>Agent Type</Typography>
        <Select
          value={selectedAgent}
          label="Agent:"
          fullWidth
          onChange={(e) => {
            const agent = e.target.value;
            setSelectedAgent(agent);
          }}
        >
          {
            userAgents.map((agent) => {
              return (
                <MenuItem value={agent}>{agent.name}</MenuItem>
              )
            })
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

