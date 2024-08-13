
export class FlowNode {
    constructor(id, position, data) {
        this.id = id;
        this.position = position;
        this.data = data;
    }

    toJson() {
        return {
            id: this.id,
            position: this.position,
            data: this.data
        }
    }
}

