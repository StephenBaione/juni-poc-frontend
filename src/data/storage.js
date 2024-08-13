import { getStorage, ref, getDownloadURL } from "firebase/storage"

export class Storage {
    constructor() { }

    _getDownloadURL(fileName) {
        const storage = getStorage();

        const storageRef = ref(storage, fileName);
        return getDownloadURL(storageRef)
        .then((url) => {
            return url;
        });
    }
}

