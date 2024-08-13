import { createSlice } from "@reduxjs/toolkit";

const agentsSlice = createSlice({
    name: 'agents',
    initialState: {
        // The initial state of the activeConversation slice
        userAgents: [],
        availableAgentsConfig: {}
    },
    reducers: {
        // The reducers for the activeConversation slice
        setUserAgents: (state, action) => {
            state.userAgents = action.payload;
        },
        setAvailableAgentsConfig: (state, action) => {
            state.availableAgentsConfig = action.payload;
        }
    },  
});

export const { setUserAgents, setAvailableAgentsConfig } = agentsSlice.actions;
export default agentsSlice.reducer;
