import { WebSocketConnection } from "./webSocket";

let webSocket = WebSocketConnection.getInstance();

// Stream Audio
let bufferSize = 2048,
    AudioContext,
    context,
    processor,
    input,
    globalStream;

const mediaConstraints = {
    audio: true,
    video: false
};

let lastFinalIndex = 0;

let AudioStreamer = {
    /**
     * @param {object} transcribeConfig Transcription configuration such as language, encoding, etc.
     * @param {function} onData Callback to run on data each time it's received
     * @param {function} onError Callback to run on an error if one is emitted.
     */
    initRecording(onSpeechMessage, onError) {
        const onMessageCallback = (resp) => {
            if (resp.data) {
                const message = JSON.parse(resp.data);
                onSpeechMessage(message);
                // if (data?.googleSpeechStream) {
                //     const messageData = data.googleSpeechStream.data;
                //     onSpeechMessage(messageData, data.googleSpeechStream.isFinal)
                //     if (data.googleSpeechStream.isFinal) {
                //         lastFinalIndex += messageData.length;
                //     }
                // }
            }
        }

        const onErrorCallback = (error) => {
            onError(error);
            closeAll();
        }

        // Reconnect to websocket if has been closed
        webSocket.connect('ws://localhost:8001/speech/stt/transcribe', onMessageCallback);

        if (!webSocket?.socketRef) {
            console.log('tf');
        }
        // webSocket?.socketRef?.on('error', onErrorCallback);


        // webSocket.connect('ws://localhost:8000/audio/ws/1234', onMessageCallback);
        AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        processor = context.createScriptProcessor(bufferSize, 1, 1);
        processor.connect(context.destination);
        context.resume();

        const handleSuccess = function (stream) {
            globalStream = stream;
            input = context.createMediaStreamSource(stream);
            input.connect(processor);

            processor.onaudioprocess = function (e) {
                microphoneProcess(e);
            };
        };

        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(handleSuccess);

        // if (onData) {p

        //   socket.on('speechData', (response) => {
        //     onData(response.data, response.isFinal);
        //   });
        // }

        // socket.on('endGoogleCloudStream', () => {
        //   closeAll();
        // });
    },

    stopRecording: function () {
        // socket.emit('endGoogleCloudStream');
        closeAll();
    }
}

export default AudioStreamer;

// Helper functions
/**
 * Processes microphone data into a data stream
 *
 * @param {object} e Input from the microphone
 */
function microphoneProcess(e) {
    const left = e.inputBuffer.getChannelData(0);
    const left16 = convertFloat32ToInt16(left);

    webSocket.sendMessage(left16, false);
}

/**
 * Converts a buffer from float32 to int16. Necessary for streaming.
 * sampleRateHertz of 1600.
 *
 * @param {object} buffer Buffer being converted
 */
function convertFloat32ToInt16(buffer) {
    let l = buffer.length;
    let buf = new Int16Array(l / 3);

    while (l--) {
        if (l % 3 === 0) {
            buf[l / 3] = buffer[l] * 0xFFFF;
        }
    }
    return buf.buffer
}

/**
 * Stops recording and closes everything down. Runs on error or on stop.
 */
function closeAll() {
    // Clear the listeners (prevents issue if opening and closing repeatedly)
    if (webSocket) webSocket.disconnect();
    let tracks = globalStream ? globalStream.getTracks() : null;
    let track = tracks ? tracks[0] : null;
    if (track) {
        track.stop();
    }

    if (processor) {
        if (input) {
            try {
                input.disconnect(processor);
            } catch (error) {
                console.warn('Attempt to disconnect input failed.')
            }
        }
        processor.disconnect(context.destination);
        processor.onaudioprocess = null;
    }
    if (context) {
        context.close().then(function () {
            input = null;
            processor = null;
            context = null;
            AudioContext = null;
        });
    }
}