import { createSlice } from "@reduxjs/toolkit";

const templatesSlice = createSlice({
    name: 'templates',
    initialState: {
        // The initial state of the activeConversation slice
        userTemplates: []
    },
    reducers: {
        // The reducers for the activeConversation slice
        setUserTemplates: (state, action) => {
            state.userTemplates = action.payload;
        },
    },  
});

export const { setUserTemplates } = templatesSlice.actions;
export default templatesSlice.reducer;
