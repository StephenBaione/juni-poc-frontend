import { InternalApi } from "./internalApi";

import store from "../data/store";

export class TemplateService {
    constructor() {
        this.internalApi = new InternalApi();
    }

    createTemplate(template) {
        return this.internalApi.createTemplate(template)
        .then((result) => {
            console.log(result)
            return result;
        })
        .catch((e) => {
            console.log(e);
            return null;
        })
    }

    updateUserTemplatesInStore(userTemplates) {
        store.dispatch({
            type: "templates/setUserTemplates",
            payload: userTemplates
        });

        return userTemplates;
    }

    loadTemplates(userId) {
        return this.listTemplates(userId)
        .then(result => {
            if (result.success && result.Item !== {}) {
                return this.updateUserTemplatesInStore(result.Item);
            }
        })
    }

    updateTemplate(template) {
        return this.internalApi.updateTemplate(template);
    }

    listTemplates(userId) {
        return this.internalApi.listTemplates(userId)
    }

    deleteTemplate(template_name, template_version) {
        return this.internalApi.deleteTemplate(template_name, template_version)
    }
}