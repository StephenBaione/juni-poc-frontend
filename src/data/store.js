import { configureStore } from '@reduxjs/toolkit';

import configReducer from './slices/cfg/configSlice';
import conversationsReducer from './slices/conversations/conversationsSlice';
import activeConversationReducer from './slices/conversations/activeConversationSlice';
import displayReducer from './slices/display/displaySlice';
import currentUserReducer from './slices/user/currentUserSlice';
import agentReducer from './slices/agents/agentSlice';
import templateReducer from './slices/templates/templatesSlice';
import flowsReducer from './slices/flows/flowsSlice';

export default configureStore({
    reducer: {
        config: configReducer,
        conversations: conversationsReducer,
        activeConversation: activeConversationReducer,
        display: displayReducer,
        currentUser: currentUserReducer,
        agents: agentReducer,
        templates: templateReducer,
        flows: flowsReducer
    },
})

