import { Timestamp } from "firebase/firestore";
import { generateUUID } from "three/src/math/MathUtils";

export class ChatMessage {
    constructor(sender, message, model) {
        this.id = generateUUID();
        this.sender = sender;
        this.model = model;
        this.message = message;
        this.created = null;
        this.updated = null;
        this.user = 'stephenbaione'

        this.prompt_suffix = '->'
    }

    setId(id) {
        this.id = id;
    }

    getObj() {
        return {
            id: this.id,
            sender: this.sender,
            message: this.message
        }
    }

    static initTimestamp(data) {
        data.created = Timestamp.now();
        data.updated = data.created;

        return data;
    }

    static serialize(data) {
        data.created = data.created?.toDate ? data.created.toDate().toDateString() : data.created;
        data.updated = data.updated?.toDate ? data.updated.toDate().toDateString() : data.updated;
        return data;
    }

    static fromJson(json, serializable = false) {
        const chatMessage = new ChatMessage(json.sender, json.message, json.model);
        chatMessage.id = json.id;
        chatMessage.created = json.created;
        chatMessage.updated = json.updated;
        if (serializable) {
            return ChatMessage.serialize(chatMessage);
        }

        return chatMessage;
    }

    toJson(serializable = false) {
        let data = {
            id: this.id,
            user: this.user,
            sender: this.sender,
            model: this.model,
            message: this.message,
            created: this.created,
            updated: this.updated
        }

        if (serializable) {
            return ChatMessage.serialize(data);
        }

        return data;
    }
}

