import { Conversation } from "../models/conversation";

import { ChatMessage } from "../models/chat/chatMessage";

import { InternalService } from "./internalService";

import { InternalApi } from "../../services/internalApi";

import { Database } from "../db";

import store from "../store";
import { Chat, ChatOutlined } from "@mui/icons-material";

export class ConversationService {
    constructor() {
        this.database = new Database();
        this.internalService = new InternalService();
        this.internalApi = new InternalApi();

        this.conversations = [];
        this.subscriptions = [];
    }

    getConversationObj(conversationData, serializable = false) {
        return Conversation.fromJson(conversationData, serializable, true);
    }

    serializableCallback(conversation) {
        conversation.created = conversation.created?.toDate ? conversation.created.toDate().toDateString() : conversation.created;
        conversation.updated = conversation.updated?.toDate ? conversation.updated.toDate().toDateString() : conversation.updated;
        return conversation;
    }

    loadUserConversations(user_id, activeConversationId = null) {
        this.listConversations(user_id).then((result) => {
            if (result.success && result.Item !== {}) {
                const conversations = result.Item;
                store.dispatch({
                    type: "conversations/setUserConversations",
                    payload: conversations,
                });

                if (activeConversationId !== null) {
                    store.dispatch({
                        type: "conversations/setActiveConversationById",
                        payload: {
                            id: activeConversationId
                        }
                    });
                }
            }
        });
    }

    addConversation(conversationData) {
        return this.internalApi.createConversation(conversationData)
    }

    listConversations(user_id) {
        return this.internalApi.listConversations(user_id)
    }

    listMessages(conversation_id) {
        return this.internalApi.listMessages(conversation_id);
    }

    deleteConversation(user_id, conversation_id) {
        return this.internalApi.deleteConversation(user_id, conversation_id);
    }

    async listConversationsByUser(user) {
        const conversations = await this.database.simpleItemQuery("conversation", "user", "==", user);
        return conversations.map((conversation) => this.getConversationObj(conversation, true));
    }

    async sendAndRespondToMessage(conversationId, message, sender, model) {
        let chatMessage = new ChatMessage(sender, message, model);
        chatMessage = ChatMessage.initTimestamp(chatMessage);

        await this.addChatMessage(conversationId, chatMessage);
        await this.getCompletion(conversationId, chatMessage, true);
    }

    _truncate_history(messages, staticPromptPrefix = '', maxLength = 1000) {
        let history = '';

        let currentLength = staticPromptPrefix.length + 1;
        messages.forEach((message) => {
            let messageToAdd = message.sender === 'stephenbaione' ? 'user: ' : 'bot: ';

            let messageSuffix = message.sender === 'stephenbaione' ? '' : '||DONE||';

            messageToAdd += message.message + messageSuffix + '\n';
            const messageLength = messageToAdd.length;

            if (currentLength + messageLength <= maxLength) {
                currentLength += messageLength;
                history = messageToAdd + history;
            }
        });

        history = staticPromptPrefix + '\n' + history;

        return history;
    }

    static getConversationFieldRedux(conversationId, field) {
        const conversation = store.getState()?.conversations?.value?.find((conversation) => conversation.id === conversationId);

        return conversation && conversation[field] ? conversation[field] : null;
    }


    async getHistory(conversationId, useActiveConversation = false) {
        let messages = [];

        let staticPromptPrefix = ConversationService.getConversationFieldRedux(conversationId, 'staticPromptPrefix');
        staticPromptPrefix = staticPromptPrefix ? staticPromptPrefix : '';

        if (useActiveConversation) {
            let activeConversationMessages = { ...store.getState().conversations.activeConversation?.messages };
            if (activeConversationMessages) {
                let keys = Object.keys(activeConversationMessages).reverse();
                keys = keys.length >= 20 ? keys.slice(0, 20) : keys;

                keys.forEach((key) => {
                    messages.push(activeConversationMessages[key]);
                });
            }
        } else {
            messages = await this.database.getField("conversation", conversationId, "messages", ('created', 'desc'), 20)
                .then((messages) => {
                    return messages;
                }).catch((error) => {
                    console.log(error);
                    return null;
                });

            if (!messages) {
                return null;
            }
        }

        return this._truncate_history(messages, staticPromptPrefix);
    }


    async addChatMessage(conversationId, chatMessage, serialize = true) {
        try {
            const messageToSend = serialize ? chatMessage.toJson(true) : chatMessage;

            const result = await this.database.addToArray("conversation", conversationId, "messages", messageToSend);
            if (result) {
                let serializableMessage = serialize ? chatMessage.toJson(true) : chatMessage;
                store.dispatch({
                    type: "conversations/addMessage",
                    payload: {
                        conversationId: conversationId,
                        chatMessage: serializableMessage,
                    },
                });
                return serializableMessage;
            }
        } catch (error) {
            console.log(error);
            chatMessage.timestamp = null;
        }

        return chatMessage;
    }

    async deleteMessage(conversationId, chatMessage) {
        try {
            const result = await this.database.removeFromArray("conversation", conversationId, "messages", chatMessage);
            if (result) {
                store.dispatch({
                    type: "conversations/removeMessage",
                    payload: {
                        conversationId: conversationId,
                        messageId: chatMessage.id,
                    },
                });
                return chatMessage.id;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async handleCompletionStream(conversationId, chatMessage, activeConversation = true) {
        const response = await this.internalService.getCompletionStream(chatMessage);

        if (!response.ok) {
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        const completionString = '';
        const messageCreated = false;
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            // First value sent is the chat message
            if (!messageCreated) {

            }

            const decodedValue = decoder.decode(value);
            const chatMessage = ChatMessage.initTimestamp(ChatMessage.fromJson(decodedValue, true));
            await this.addChatMessage(conversationId, chatMessage, false);
        }
    }

    cleanCompletion(completion) {
        if (!completion) {
            return null;
        }

        const cleanedCompletion = { ...completion };

        // Remove new lines from completion
        cleanedCompletion.message = cleanedCompletion.message.replace(/(\r\n|\n|\r)/gm, "");
        return cleanedCompletion;
    }

    async getCompletion(conversationId, chatMessage, activeConversation = false, stream = false) {
        if (!chatMessage) {
            return;
        }

        const history = await this.getHistory(conversationId, activeConversation, true);
        chatMessage = chatMessage.toJson(true);

        const chatMessageCompletion = { ...chatMessage };
        chatMessageCompletion.message = history;

        if (chatMessageCompletion.prompt_suffix) {
            chatMessageCompletion.message += chatMessageCompletion.prompt_suffix;
        }

        console.log('sending', chatMessageCompletion.message);

        let responseChatMessage = await this.internalService.getCompletion(chatMessageCompletion);
        if (!responseChatMessage) {
            return null;
        }

        responseChatMessage = ChatMessage.initTimestamp(responseChatMessage);
        responseChatMessage = ChatMessage.serialize(responseChatMessage);
        await this.addChatMessage(conversationId, responseChatMessage, false)
        return responseChatMessage;
    }

    playAudio(audioContent) {
        if (audioContent === null) {
            return;
        }

        const audio = new Audio();
        audio.src = audioContent;

        audio.play(0)
            .then(() => {
                console.log('audio played');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async textToSpeech(text) {
        const response = await this.internalService.getTextToSpeech(text);

        let AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioContext = new AudioContext();

        let audio = new Audio(response.url);
        audio.play();
    }
}