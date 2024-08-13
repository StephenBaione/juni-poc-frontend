import { ChatMessage } from "../models/chat/chatMessage";

export class InternalService {
    constructor() {
        this.data = [];
        this.baseUrl = 'http://localhost:8001';
    }

    // Write a method that makes post requests,
    // that accepts all of the necessary parameters
    // makes a post request to the baseUrl + provided endpoint
    // and returns the response
    async postRequest(endpoint, data) {
        const url = `${this.baseUrl}/${endpoint}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.log(response.status);
            return null;
        }
    }
    
    async getRequest(endpoint) {
        const url = `${this.baseUrl}/${endpoint}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.log(response.status);
            return null;
        }
    }

    // Write a method that takes an object params and returns a string formatted to be appended onto the url of a get request
    // Example: { name: 'John', age: 30 } => '?name=John&age=30'
    static paramsToString(params) {
        let paramString = '?';

        for (const [key, value] of Object.entries(params)) {
            paramString += `${key}=${value}&`;
        }

        // Remove the last ampersand
        paramString = paramString.slice(0, -1);
        return paramString;
    }

    async getTextToSpeech(text) {
        const endpoint = '/text_to_speech';

        const params = {
            text,
            voice: 'en-US-Studio-O',
        };

        const paramString = InternalService.paramsToString(params);
        
        const response = await fetch(`${this.baseUrl}${endpoint}${paramString}`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            },
        });

        if (response.ok) {
            return response;
        } else {
            return null;
        }
    }

    async getCompletion(chatMessage) {
        const endpoint = 'openai/completion';

        return await this.postRequest(endpoint, chatMessage);
    }

    async getCompletionStream(chatMessage) {
        const endpoint = 'openai/completion/stream';

        return await this.postRequest(endpoint, chatMessage);
    }

    async listModels() {
        const endpoint = 'openai/models';

        return await this.getRequest(endpoint);
    }

    async listModelIds() {
        const model_data = await this.listModels();
        if (!model_data) {
            return [];
        }

        const modelIds = model_data.data.map(model => model.id);
        return modelIds;
    }
}

