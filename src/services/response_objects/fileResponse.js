export class FileResponse {
    constructor(success, message, filename, data) {
        this.success = success;
        this.message = message;
        this.filename = filename;
        this.data = data;
    }
}

