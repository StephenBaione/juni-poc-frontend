import store from "../../store";

// import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
const db = null;

export class ChatService {
    constructor() {
        
    }

    getActiveConcersation() {
        return store.getState().activeConversation;
    }

    addMessage(message) {
        this.chatMessages.push(message);
    }

    getMessages() {
        return this.chatMessages;
    }

    async createConversation(conversationData) {
        const conversation = await addDoc(collection(db, "conversation"), conversationData);
        return conversation;
    }
}
