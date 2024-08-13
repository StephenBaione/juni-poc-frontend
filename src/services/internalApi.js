import { VisemeResponse } from "./response_objects/visemeResponse";
import { FileResponse } from "./response_objects/fileResponse";

import store from "../data/store";

export class InternalApi {
    constructor() {
        this.base_api_route = 'http://localhost:8001'
        // this.chatService = new ChatService();
        // this.configService = new ConfigService();
        // this.userService = new UserService();
    }
    getCompletions(prompt) {
        const route = `${this.base_api_route}/completions?prompt=${prompt}`;

        return fetch(route)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    createUser(user) {
        const route = `${this.base_api_route}/user/create`;
        console.log(JSON.stringify(user.toJson()))

        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify({
                'username': user.username,
                'email': user.email,
                'confirmed': false
            })
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    setAuthToken(user_id, auth_token) {
        const route = `${this.base_api_route}/user/auth_token/${user_id}`;
        console.log(store.getState());


        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify(auth_token)
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    getModels() {
        const route = `${this.base_api_route}/models`;

        return fetch(route)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    parseVisemesReponse(data) {
        const fileResult = data.FileResult;
        const visemeResult = data.Visemes;

        // Create file response
        const fileResponse = new FileResponse(fileResult.success, fileResult.message, fileResult.filename, fileResult.data);

        // Create viseme response
        const visemeResponse = new VisemeResponse(fileResponse, data.visemes);
        return visemeResponse;
    }

    getAvatarSpeech(text) {
        text = encodeURIComponent(text);

        const route = `${this.base_api_route}/speech/viseme?text=${text}`;

        // Make post request to route
        return fetch(route, {
            method: "POST",
            body: JSON.stringify({ text }),
        })
            .then(response => response.json())
            .then(data => {
                const fileResult = data.FileResult;

                // Create file response
                const fileResponse = new FileResponse(fileResult.success, fileResult.message, fileResult.file_name, fileResult.data);

                // Create viseme response
                const visemeResponse = new VisemeResponse(fileResponse, data.Visemes);

                return visemeResponse;
            })
            .catch(error => console.log(error));
    }

    getUser(user_id) {
        const route = `${this.base_api_route}/user/${user_id}`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    getUserByEmail(email) {
        const route = `${this.base_api_route}/user/by_email/${email}`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    confirmUser(user_id) {
        const route = `${this.base_api_route}/user/confirm/${user_id}`;

        return fetch(`${route}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    createTemplate(template) {
        const route = `${this.base_api_route}/template/create`;

        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify({
                'template_name': template.templateName,
                'template_version': template.templateVersion,
                'tag': template.tag,
                'template': template.template,
                'creator': template.creator,
                'input_variables': template.inputVariables,
            })
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    updateTemplate(template) {
        const route = `${this.base_api_route}/template/${template.templateName}/${template.templateVersion}/update`;

        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify({
                'id': template.id,
                'template_name': template.templateName,
                'template_version': template.templateVersion,
                'tag': template.tag,
                'template': template.template,
                'creator': template.creator,
                'input_variables': template.inputVariables,
            })
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    listTemplates(userId) {
        const route = `${this.base_api_route}/template/creator/${userId}/list`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    deleteTemplate(template_name, template_version) {
        const route = `${this.base_api_route}/template/${template_name}/${template_version}`;

        return fetch(`${route}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    createAgent(agent) {
        const route = `${this.base_api_route}/agent/create_agent`;

        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify({
                'name': agent.name,
                'service': agent.service,
                'type': agent.type,
                'input_type': agent.inputType,
                'output_type': agent.outputType,
                'purpose': agent.purpose,
                'owner': agent.owner,
            })
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    updateAgent(agent) {
        const route = `${this.base_api_route}/agent/${agent.owner}/${agent.name}/agent/update`;

        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify({
                'name': agent.name,
                'service': agent.service,
                'type': agent.type,
                'input_type': agent.inputType,
                'output_type': agent.outputType,
                'purpose': agent.purpose,
                'owner': agent.owner,
            })
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    deleteAgent(owner, name) {
        const route = `${this.base_api_route}/agent/${owner}/${name}/delete`;

        return fetch(`${route}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    listAgent(owner) {
        const route = `${this.base_api_route}/agent/${owner}/agent/list`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    listIndexes() {
        const route = `${this.base_api_route}/pinecone/index/list`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    listNamespaces(index_name) {
        const route = `${this.base_api_route}/pinecone/index/${index_name}/namespace/all`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    createConversation(conversationData) {
        const route = `${this.base_api_route}/conversation/create`;

        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify(conversationData)
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    listConversations(user_id) {
        const route = `${this.base_api_route}/conversation/list/${user_id}`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    deleteConversation(user_id, conversation_id) {
        const route = `${this.base_api_route}/conversation/delete/${user_id}/${conversation_id}`;

        return fetch(route, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .catch(error => console.log(error));
    }

    listMessages(conversationId) {
        const route = `${this.base_api_route}/conversation/chat/${conversationId}/list`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    getAvailableAgentsConfig(version = 'v2') {
        const route = `${this.base_api_route}/agent/available_agents?version=${version}`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    getFlowAvailabilityConfig(version = 'v1') {
        const route = `${this.base_api_route}/flow/available_flows?version=${version}`;

        return fetch(`${route}`)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    saveFlowTemplate(nodes, edges, user_id, flow_id = null) {
        const route = `${this.base_api_route}/flow/save`;

        let data = {
            nodes,
            edges,
            user_id
        }

        // A new flow won't have an id until it is saved
        if (flow_id !== null) {
            data['flow_id'] = flow_id
        }

        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    listUserFlows(user_id) {
        const route = `${this.base_api_route}/flow/user_flows/${user_id}`

        return fetch(route)
            .then(response => response.json())
            .catch(error => console.log(error))
    }

    getFlow(flow_id) {
        const route = `${this.base_api_route}/flow/get_flow/${flow_id}`;

        return fetch(route)
            .then(response => response.json())
            .catch(error => console.log(error))
    }

    deleteFlow(flow_id) {
        const route = `${this.base_api_route}/flow/delete_flow/${flow_id}`;

        return fetch(route, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    runFlow(flow_id, inputData) {
        const route = `${this.base_api_route}/flow/run_flow/${flow_id}`;

        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify({
                flow_id,
                input_data: inputData
            })
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    setFlowName(flow_id, flow_name) {
        const route = `${this.base_api_route}/flow/set_name/${flow_id}`;

        return fetch(route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            mode: 'cors',
            body: JSON.stringify({
                flow_name
            })
        })
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    getDefaultUserAvatarUrl() {
        const route = `${this.base_api_route}/user/avatar/default`;

        return fetch(route)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    getUserAvatarUrl(user_id) {
        const route = `${this.base_api_route}/user/avatar/${user_id}`;

        return fetch(route)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    setAvatar(user_id, file) {
        const route = `${this.base_api_route}/user/avatar/${user_id}`;

        let formData = new FormData();
        formData.append('file', file);

        return fetch(route, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .catch(error => console.log(error))
    }
}

