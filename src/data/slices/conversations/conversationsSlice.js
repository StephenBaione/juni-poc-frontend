import { createSlice } from "@reduxjs/toolkit";

export const conversationsSlice = createSlice({
    name: 'conversations',
    initialState: {
        // The initial state of the conversations slice
        value: [],
        activeConversation: null,
        activeMessages: [],
        userConversations: []
    },
    reducers: {
        // Set conversation value, action should be a list of conversations
        setConversations: (state, action) => {
            state.value = action.payload;
        },
        // The reducers for the conversations slice
        addConversation: (state, action) => {
            if (!action.payload.id) {
                action.payload.id = state.value.length + 1;
            }
            state.value.push(action.payload);
        },
        // Remove conversation, action should be the id of the conversation to remove
        removeConversation: (state, action) => {
            state.value = state.value.filter(conversation => conversation.id !== action.payload);

            // Set activeConversation to null if the active conversation was removed
            if (state.activeConversation?.id === action.payload) {
                state.activeConversation = null;
            }
        },
        // Update conversation, action should be the conversation object to update
        updateConversation: (state, action) => {
            state.value = state.value.map(conversation => {
                if (conversation.id === action.payload.id) {
                    return action.payload;
                } else {
                    return conversation;
                }
            });
        },
        // Add message to conversation, action should be the conversation id and message object
        addMessage: (state, action) => {
            const conversationId = action.payload.conversationId;
            const serializableChatMessage = action.payload.chatMessage;

            state.value = state.value.map(conversation => {
                if (conversation.id === conversationId) {
                    conversation.messages.push(serializableChatMessage);
                    conversation.lastMessage = serializableChatMessage.message;
                    if (conversation.id === state.activeConversation?.id) {
                        state.activeConversation = conversation;
                    }

                    return conversation;
                } else {
                    return conversation;
                }
            });
        },
        // Update message in conversation, action should be the conversation id and message object
        updateMessage: (state, action) => {
            state.value = state.value.map(conversation => {
                if (conversation.id === action.payload.id) {
                    conversation.messages = conversation.messages.map(message => {
                        if (message.id === action.payload.message.id) {
                            return action.payload.message;
                        } else {
                            return message;
                        }
                    });
                    return conversation;
                } else {
                    return conversation;
                }
            });
        },
        // Remove message from conversation, action should be the conversation id and message id
        removeMessage: (state, action) => {
            state.value = state.value.map(conversation => {
                if (conversation.id === action.payload.conversationId) {
                    conversation.messages = conversation.messages.filter(message => message.id !== action.payload.messageId);
                    return conversation;
                } else {
                    return conversation;
                }
            });

            if (action.payload.conversationId === state.activeConversation?.id) {
                state.activeConversation = state.value.find(conversation => conversation.id === action.payload.conversationId);
            }
        },
        // Set active conversation, action should be the conversation id
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload;
        },
        setActiveConversationById: (state, action) => {
            const conversationId = action.payload.id;

            const userConversations = state.userConversations;
            userConversations.forEach((conversation) => {
                if (conversation.id === conversationId) {
                    state.activeConversation = conversation;
                }
            });
        },
        // Get a field from a conversation, action should be the conversation id and field name
        getConversationField: (state, action) => {
            return state.value.find(conversation => conversation.id === action.payload.conversationId)[action.payload.field];
        },
        setUserConversations: (state, action) => {
            state.userConversations = action.payload;
        }
    },
});

export const {
    addConversation, removeConversation, updateConversation,
    addMessage, updateMessage, removeMessage,
    setActiveConversationById, setActiveConversation, setConversations,
    setUserConversations
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
