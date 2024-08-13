import { createSlice } from "@reduxjs/toolkit";

const activeConversationSlice = createSlice({
    name: 'activeConversation',
    initialState: {
        // The initial state of the activeConversation slice
        value: null,
        test: true,
    },
    reducers: {
        // The reducers for the activeConversation slice
        setActiveConversation: (state, action) => {
            state.value = action.payload;
        },
    },  
});

export const { setActiveConversation } = activeConversationSlice.actions;
export default activeConversationSlice.reducer;
