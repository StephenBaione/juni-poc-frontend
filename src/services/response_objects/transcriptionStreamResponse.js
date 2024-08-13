export const TranscriptionStreamEventTypes = Object.freeze({
    TRANSCRIBE_STREAM_STARTED: Symbol('TRANSCRIBE_STREAM_STARTED'),
    TRANSCRIBE_STREAM_STOPPED: Symbol('TRANSCRIBE_STREAM_STOPPED'),
    TRANSCRIBE_STREAM_RECOGNIZED: Symbol('TRANSCRIBE_STREAM_RECOGNIZED'),
    TRANSCRIBE_STREAM_RECOGNIZING: Symbol('TRANSCRIBE_STREAM_RECOGNIZING')
})

export class TranscriptionStreamResponse {
    constructor(client_id, data, event) {
        this.client_id = client_id
        this.data = data
        this.event = event
    }

    static fromJson(json) {
        return new TranscriptionStreamResponse(
            json.client_id,
            json.data,
            json.event
        )
    }

    toJson() {
        return {
            client_id: this.client_id,
            data: this.data,
            event: this.event
        }
    }
}
