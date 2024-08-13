import { generateUUID } from "three/src/math/MathUtils";

export class Conversation {
    constructor(name, model, user) {
        this.id = generateUUID();
        this.name = name;
        this.model = model;
        this.user = user;
        this.messages = [];
        this.lastMessage = null;
        this.created = null;
        this.updated = null;
        this.staticPromptPrefix = null;

        this.stored = false;
    }

    static serialize(data) {
        data.created = data.created?.toDate ? data.created.toDate().toDateString() : data.created;
        data.updated = data.updated?.toDate ? data.updated.toDate().toDateString() : data.updated;
        return data;
    }

    static fromJson(json, serializable = false) {
        const conversation = new Conversation(json.name, json.model);
        conversation.id = json.id;
        conversation.lastMessage = json.lastMessage;
        conversation.messages = json.messages;
        conversation.lastMessage = json.lastMessage;
        conversation.created = json.created;
        conversation.updated = json.updated;
        conversation.user = json.user;
        conversation.staticPromptPrefix = json.staticPromptPrefix;

        if (serializable) {
            return Conversation.serialize(conversation);
        }

        return conversation;
    }

    toJson(serializable=false) {
        const data = {
            id: this.id,
            name: this.name,
            model: this.model,
            lastMessage: this.lastMessage,
            messages: this.messages,
            created: this.created,
            updated: this.updated,
            user: this.user,
            staticPromptPrefix: this.staticPromptPrefix
        };

        if (serializable) {
            return Conversation.serialize(data);
        }

        return data;
    }

    addMessage(message) {
        this.messages.push(message);
    }

    getMessages() {
        return this.messages;
    }
}

