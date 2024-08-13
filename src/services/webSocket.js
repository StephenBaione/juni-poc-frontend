export class WebSocketConnection {
    constructor() {
        this.socketRef = null;
        this.closeConnection = false;
    }

    static instance = null;
    callbacks = {};

    static getInstance() {
        if (!WebSocketConnection.instance) {
            WebSocketConnection.instance = new WebSocketConnection();
        }
        return WebSocketConnection.instance;
    }

    connect(chatUrl, onMessageCallback) {
        this.closeConnection = false;
        this.socketRef = new WebSocket(chatUrl);
        this.socketRef.onopen = () => {
            console.log("WebSocket open");
        };
        this.socketRef.onmessage = e => {
            console.log(e);
            if (onMessageCallback) {
                onMessageCallback(e);
            }
        };
        this.socketRef.onerror = e => {
            console.log('received')
            console.log(e.message);
        };
        this.socketRef.onclose = () => {
            console.log('closing')
            if (!this.closeConnection) {
                console.log("WebSocket closed let's reopen");
                this.connect(this.ws_url);
            }
        };
    }

    // Send data to the server
    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.command;

        if (Object.keys(this.callbacks).length === 0) {
            return;
        }

        if (command === 'messages') {
            this.callbacks[command](parsedData.messages);
        }

        if (command === 'new_message') {
            this.callbacks[command](parsedData.message);
        }
    }

    // Add a callback function to the callbacks object
    fetchMessages(username) {
        this.sendMessage({
            command: 'fetch_messages',
            username
        });
    }

    // Add a callback function to the callbacks object
    newChatMessage(message) {
        this.sendMessage({
            command: 'new_message',
            from: message.from,
            message: message.content
        });
    }

    // Add a callback function to the callbacks object
    addCallbacks(messagesCallback, newMessageCallback) {
        this.callbacks['messages'] = messagesCallback;
        this.callbacks['new_message'] = newMessageCallback;
    }

    // Send data to the server
    sendMessage(data, json = true) {
        try {
            if (json) {
                this.socketRef.send(JSON.stringify({ ...data }));
            } else {
                this.socketRef.send(data);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    // Disconnect from the server
    disconnect() {
        this.closeConnection = true;
        if (this.socketRef?.readyState !== WebSocket.CLOSED) this.socketRef?.close();
    }
}

