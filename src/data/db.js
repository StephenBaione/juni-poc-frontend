import { db } from "../firebase";

import {
    doc, onSnapshot, setDoc, getDoc, getDocs, updateDoc, deleteDoc, addDoc,
    query, where, collection,
    arrayRemove, arrayUnion, deleteField, Timestamp,
    orderBy, limit
    
} from "firebase/firestore";

export class Database {
    constructor() { }

    getInstance() {
        if (this) return this;

        return new Database();
    }

    async getItem(_collection, id) {
        const docRef = doc(db, _collection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }

        return null;
    }

    async simpleItemQuery(_collection, field, operator, value, _orderBy = null, _limit = null) {
        let _query = null;

        if (_orderBy) {
            if (_limit) {
                _query = query(collection(db, _collection),
                    where(field, operator, value),
                    orderBy(_orderBy),
                    limit(_limit)
                );
            } else {
                _query = query(collection(db, _collection),
                    where(field, operator, value),
                    orderBy(_orderBy)
                );
            }
        } else if (_limit) {
            _query = query(collection(db, _collection),
                where(field, operator, value),
                limit(_limit)
            );
        } else {
            _query = query(collection(db, _collection),
                where(field, operator, value)
            );
        }

        const querySnapshot = await getDocs(_query);

        const docs = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            docs.push(doc.data());
        });

        return docs;
    }

    async getAllDocs(_collection) {
        const querySnapshot = await getDocs(collection(db, _collection));
        const docs = querySnapshot.forEach((doc) => {
            return doc.data();
        });

        return docs;
    }

    async setItem(_collection, id, data) {
        console.log('first', _collection, id, data);
        return await setDoc(
            doc(db, _collection, id),
            data,
            { merge: true }
        ).catch((error) => {
            console.log(error);
            return -1;
        });
    }

    async addItem(_collection, data) {
        const id = data.id;
        if (id) {
            const setResult = await this.setItem(_collection, id, data);
            return setResult === -1 ? null : data;
        }

        return await addDoc(collection(db, _collection), data);
    }

    async updateItem(_collection, id, data) {
        return await updateDoc(
            doc(db, _collection, id),
            data
        );
    }

    getArrayRemove(item) {
        return arrayRemove(item);
    }

    getArrayUnion(item) {
        return arrayUnion(item);
    }

    async addToArray(_collection, id, field, item) {
        try {
            await updateDoc(
                doc(db, _collection, id), {
                [field]: arrayUnion(item)
            });

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async removeFromArray(_collection, id, field, item) {
        try {
            await updateDoc(
                doc(db, _collection, id), {
                [field]: arrayRemove(item)
            });

            return true;
        } catch (error) {
            console.log('Error Removing from array: ', error, _collection, id, field, item)

            return false;
        }
    }

    async incrementValue(_collection, id, field, value) {
        return await updateDoc(
            doc(db, _collection, id), {
            [field]: value
        });
    }

    async deleteItem(_collection, id) {
        console.log("deleteItem", _collection, id);
        await deleteDoc(
            doc(db, _collection, id)
        ).catch((error) => {
            console.log(error);
            return false;
        });

        return true;
    }

    async getField(_collection, id, field, _orderBy = null, _limit = null) {
        const docSnap = await this.simpleItemQuery(_collection, 'id', '==', id, _orderBy, _limit);

        if (docSnap.exists()) {
            return docSnap.data()[field];
        }
    }

    async removeField(_collection, id, field) {
        return await updateDoc(
            doc(db, _collection, id), {
            [field]: deleteField()
        });
    }

    createListenerQuery(_collection, field, operator, value, callback) {
        return onSnapshot(query(collection(db, _collection),
            where(field, operator, value)
        ), (querySnapshot) => {
            const docs = querySnapshot.forEach((doc) => {
                return doc.data();
            });

            callback(docs);
        });
    }

    getTimestamp(date = null) {
        if (date === null) return Timestamp.now();

        return Timestamp.fromDate(date);
    }
}

