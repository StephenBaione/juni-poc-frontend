import { createSlice } from "@reduxjs/toolkit";

const flowsSlice = createSlice({
    name: 'flows',
    initialState: {
        // The initial state of the activeConversation slice
        userFlows: [],
        activeFlow: {},
    },
    reducers: {
        // The reducers for the activeConversation slice
        setUserFlows: (state, action) => {
            state.userFlows = action.payload;
        },
        setActiveFlow: (state, action) => {
            state.activeFlow = action.payload;
        }
    },  
});

export const { setUserFlows, setActiveFlow } = flowsSlice.actions;
export default flowsSlice.reducer;
