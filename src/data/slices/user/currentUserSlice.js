import { createSlice } from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: {
        user: {
            id: null,
            username: '',
            email: '',
            authToken: null,
            confirmed: false,
            avatar_url: ''
        },
        userPresent: false,
    },
    reducers: {
        setUserPresent: (state, action) => {
            state.userPresent = action.payload;
        },
        setUser: (state, action) => {
            const id = action.payload.id;
            const username = action.payload.username;
            const email = action.payload.email;
            const authToken = action.payload.auth_token;
            const confirmed = action.payload.confirmed;
            const avatar_url = action.payload.avatar_url;

            state.user.id = id;
            state.user.username = username;
            state.user.email = email;
            state.user.authToken = authToken;
            state.user.confirmed = confirmed
            state.user.avatar_url = avatar_url;
        },
        setConfirmed: (state, action) => {
            state.user.confirmed = action.payload;
        },
        setAvatarUrl: (state, action) => {
            state.user.avatar_url = action.payload;
        }
    }
})

export const {
    setUserPresent,
    setUser,
    setConfirmed,
    setAvatarUrl
} = currentUserSlice.actions;

export default currentUserSlice.reducer;
