
import { InternalApi } from "./internalApi";

const azure_visemes_cfg = require('./cfg/azure_visemes_cfg.json')

export class TextToSpeechService {
    constructor() {
        this.textToSpeech = "http://localhost:8001/tts/synthesize";
        this.textToSpechVisemePost = "http://localhost:8001/speech/viseme";
        this.internalApi = new InternalApi();
        this.audioChunks = [];

        this.visemesIndexMap = azure_visemes_cfg['VisemeIndexMap'];
    }

    getDownloadUrl(filename) {
        return `${this.textToSpeech}/download?filename=${filename}`;
    }

    postTextToSpeechWithViseme(text) {
        const visemeResult = this.internalApi.getAvatarSpeech(text);
        return visemeResult;
    }

    async speak(text) {
        const mediaSource = new MediaSource();
        mediaSource.addEventListener('error', (event) => {
            console.error(`MediaSource error: ${event}`);
        });
    
        const audio = new Audio();
        audio.src = URL.createObjectURL(mediaSource);
        audio.autoplay = true;
        audio.controls = true;
    
        const response = await fetch(this.textToSpeech, {
            method: "POST",
            body: JSON.stringify({ text }),
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
        });
    
        const reader = response.body.getReader();
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        sourceBuffer.mode = 'sequence';
    
        let audioData = [];
        sourceBuffer.addEventListener('updateend', () => {
            if (audioData.length > 0 && !sourceBuffer.updating) {
                sourceBuffer.appendBuffer(audioData.shift());
            }
        });
    
        let bytesReceived = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
    
            bytesReceived += value.length;
            audioData.push(value);
    
            if (!sourceBuffer.updating && audioData.length > 0) {
                sourceBuffer.appendBuffer(audioData.shift());
            }
        }
    
        console.log(`Received ${bytesReceived} bytes of data so far`)
    }
}

