import { createSlice } from "@reduxjs/toolkit";

export const displaySlice = createSlice({
    name: 'display',
    initialState: {
        showMenu: true
    },
    reducers: {
        setShowMenu: (state, action) => {
            state.showMenu = action.payload;
        }
    }
})

export const {
    setShowMenu
} = displaySlice.actions;
export default displaySlice.reducer;
