import { InternalApi } from "./internalApi";

import store from "../data/store";

export class AgentService {
    constructor() {
        this.internalApi = new InternalApi();
    }

    createAgent(agent) {
        return this.internalApi.createAgent(agent)
        .then((result) => {
            console.log(result)
            return result;
        })
        .catch((e) => {
            console.log(e);
            return null;
        })
    }

    updateUserAgentsInStore(userAgents) {
        store.dispatch({
            type: "agents/setUserAgents",
            payload: userAgents
        })

        return userAgents
    }

    loadUserAgents(userId) {
        return this.listAgents(userId)
        .then(result => {
            if (result.success && result.Item !== {}) {
                return this.updateUserAgentsInStore(result.Item)
            }
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }

    updateAgent(agent) {
        return this.internalApi.updateAgent(agent);
    }

    listAgents(userId) {
        return this.internalApi.listAgent(userId)
    }

    deleteAgent(owner, name) {
        return this.internalApi.deleteAgent(owner, name)
    }

    getAvailableAgentsConfig(version='v2') {
        return this.internalApi.getAvailableAgentsConfig(version);
    }
}