import { createSlice } from "@reduxjs/toolkit";

const configFile = require('./appConfig.json');

export const configSlice = createSlice({
    name: 'config',
    initialState: {
        // The initial state of the config slice
        value: configFile['dev'],
    },
    reducers: {
        // The reducers for the config slice
    },
});

export default configSlice.reducer;
        