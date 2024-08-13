import { InternalApi } from "./internalApi"

export class IndexService {
    constructor() {
        this.internalApi = new InternalApi();
    }

    listIndexes() {
        return this.internalApi.listIndexes();
    }

    listNameSpacesInIndex(index_name) {
        return this.internalApi.listNamespaces(index_name)
    }
}

