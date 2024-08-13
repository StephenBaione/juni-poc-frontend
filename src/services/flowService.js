import { InternalApi } from "./internalApi";

import store from "../data/store";

export class FlowService {
    constructor() {
        this.internalApi = new InternalApi();
}

    get_availability_config() {
        return this.internalApi.getFlowAvailabilityConfig();
    }

    saveFlow(nodes, edges, user_id, flow_id = null) {
        return this.internalApi.saveFlowTemplate(nodes, edges, user_id, flow_id)
    }

    runFlow(flow_id, input_data) {
        return this.internalApi.runFlow(flow_id, input_data)
            .then(response => response)
            .catch(error => console.log(error));
    }

    listUserFlows(user_id) {
        return this.internalApi.listUserFlows(user_id)
    }

    saveUserFlowsToStore(userFlows) {
        store.dispatch({
            type: 'flows/setUserFlows',
            payload: userFlows
        });
    }

    loadUserFlows(userId) {
        this.listUserFlows(userId)
        .then(result => {
            if (result.success && result.Item !== {}) {
                this.saveUserFlowsToStore(result.Item)
            }
        })
    }

    getFlow(flow_id) {
        return this.internalApi.getFlow(flow_id)
        .then(result => {
            if (result.success && result.Item !== {}) {
                return result.Item;
            }
        })
    }

    deleteFlow(flow_id) {
        return this.internalApi.deleteFlow(flow_id)
        .then(result => {
            return result.success;
        })
    }

    setFlowName(flow_id, flow_name) {
        return this.internalApi.setFlowName(flow_id, flow_name)
            .then(result => {
                return result.success
            });
    }
}

