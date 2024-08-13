import {
    AddCustomAttributesCommand, AuthFlowType,
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    GetUserCommand,
    ResendConfirmationCodeCommand,
    ForgotPasswordCommand, 
    ConfirmForgotPasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";

import { auth } from "firebaseui";

import { InternalApi } from "./internalApi";

import store from "../data/store";

const lodash = require('lodash');

class AuthToken {
    constructor(
        accessToken,
        expiresIn,
        idToken,
        newDeviceMetadata,
        refreshToken,
        tokenType
    ) {
        this.AccessToken = accessToken;
        this.ExpiresIn = expiresIn;
        this.IdToken = idToken;
        this.NewDeviceMetadata = newDeviceMetadata;
        this.RefreshToken = refreshToken;
        this.TokenType = tokenType;
    }

    toJson() {
        return {
            AccessToken: this.AccessToken,
            ExpiresIn: this.ExpiresIn,
            IdToken: this.IdToken,
            NewDeviceMetadata: this.NewDeviceMetadata,
            RefreshToken: this.RefreshToken,
            TokenType: this.TokenType,
        }
    }
}

export class User {
    constructor(username, email, auth_token = null, confirmed = false, id = null) {
        if (id) {
            this.id = id;
        }

        this.username = username;
        this.email = email;
        this.auth_token = auth_token;
        this.confirmed = confirmed;
    }

    toJson() {
        let data = {
            username: this.username,
            email: this.email,
            auth_token: this.auth_token ? this.auth_token.toJson() : {},
            confirmed: this.confirmed,
        }

        if (this.id) {
            data['id'] = this.id;
        }

        return data;
    }
}

export default class UserService {
    constructor() {
        this.poolData = {
            UserPoolId: 'us-east-1_Rh8uQUwQM',
            ClientId: '2rol41kh3fk7ifbkigrccu3dj8'
        }

        this.identityClient = new CognitoIdentityProviderClient({
            region: 'us-east-1'
        })

        this.internalApi = new InternalApi();
    }

    setLocalUserInfo(user) {
        this.setLocalUserId(user.id);
        this.setLocalUserEmail(user.email);
        this.setLocalUsername(user.username);
        this.setLocalAuthToken(user.auth_token);
    }

    getLocalUserId() {
        return localStorage.getItem('user_id')
    }

    setLocalUserId(user_id) {
        return localStorage.setItem('user_id', user_id)
    }

    getLocalUserEmail() {
        return localStorage.getItem('email')
    }

    setLocalUserEmail(email) {
        return localStorage.setItem('email', email)
    }

    getLocalUsername() {
        return localStorage.getItem('username')
    }

    setLocalUsername(username) {
        return localStorage.setItem('username', username)
    }

    getLocalAuthToken() {
        return localStorage.getItem('auth_token')
    }

    setLocalAuthToken(auth_token) {
        return localStorage.setItem('auth_token', JSON.stringify(auth_token));
    }

    clearLocalUserInfo() {
        localStorage.clear('user_id')
        localStorage.clear('email')
        localStorage.clear('username')
        localStorage.clear('auth_token')
    }

    async loadUserFromLocal() {
        const user_id = localStorage.getItem('user_id')
        const email = localStorage.getItem('email')
        const username = localStorage.getItem('username')
        const auth_token = localStorage.getItem('auth_token') ? JSON.parse(localStorage.getItem('auth_token')) : null;

        await this.getUserByAuthToken(auth_token)

        if (!user_id) return;

        return this.getUser(user_id)
        .then((getResult) => {
            if (getResult.success && !lodash.isEmpty(getResult.Item)) {
                store.dispatch({
                    type: 'currentUser/setUser',
                    payload: getResult.Item[0]
                });

                store.dispatch({
                    type: 'currentUser/setUserPresent',
                    payload: true
                });
            }

            return getResult;
        })
    }

    updateUser(userData) {
        store.dispatch({
            type: 'currentUser/setUser',
            payload: userData
        });

        store.dispatch({
            type: 'currentUser/setUserPresent',
            payload: true,
        });

        this.setLocalUserInfo(userData);
    }

    async getUserDetails(email) {
        const command = new GetUserCommand({
            UserPoolId: this.poolData.UserPoolId,
            ClientId: this.poolData.ClientId,
            Username: email
        });

        return this.identityClient.send(command);
    }

    async getDefaultUserAvatarUrl() {
        return this.internalApi.getDefaultUserAvatarUrl()
        .then((result) => {
            return result;
        });
    }

    async getUserAvatarUrl(user_id) {
        return this.internalApi.getUserAvatarUrl(user_id)
        .then((result) => {
            return result.Item[0];
        });
    }

    async updateUserAvatarUrl(user_id, file) {
        let response = await this.internalApi.setAvatar(user_id, file)
        response = response.Item[0]
        
        let result = store.dispatch({
            type: 'currentUser/setAvatarUrl',
            payload: response
        });
        return response
    }

    async getUserByEmail(email) {
        return this.internalApi.getUserByEmail(email)
        .then((result) => {
            return result;
        });
    }

    async getUserByAuthToken(auth_token) {
        // get access token from auth token
        const access_token = auth_token ? auth_token.AccessToken : null;

        if (!access_token) {
            return null
        }

        // get user by access token
        const input = { // GetUserRequest
            AccessToken: access_token, // required
        };
        const command = new GetUserCommand(input);
        const response = await this.identityClient.send(command);

        if (response?.$metadata?.httpStatusCode === 200) {
            if (response.UserAttributes && response.UserAttributes.length >= 3) {
                let email = response.UserAttributes[2].Value;
                return this.getUserByEmail(email)
                .then((getResult) => {
                    // Set User Authentication Token
                    if (!getResult.success) {
                        return getResult;
                    }
                    const user = getResult.Item[0];

                    store.dispatch({
                        type: 'currentUser/setUser',
                        payload: user
                    })

                    store.dispatch({
                        type: 'currentUser/setUserPresent',
                        payload: true
                    });
                    return user;
                })  
            }
        }  
        return null;  
    }

    async login(email, password) {
        const command = new InitiateAuthCommand({
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            },
            ClientId: this.poolData.ClientId,
        })

        return this.identityClient.send(command)
        .then((result) => {
            console.log(email);
            const metaData = result.$metadata;

            if (metaData.httpStatusCode === 200) {
                return this.getUserByEmail(email)
                .then((getResult) => {
                    // Set User Authentication Token
                    if (!getResult.success) {
                        return getResult;
                    }

                    const user = getResult.Item[0];

                    store.dispatch({
                        type: 'currentUser/setUser',
                        payload: user
                    })
    
                    const userId = user.id;

                    return this.internalApi.setAuthToken(
                        userId,
                        result.AuthenticationResult,
                    ).then((result) => {
                        if (result.success) {
                            const user = result.Item;
                            this.updateUser(user);
                        }
        
                        return result;
                    })
                })
            }

            return null;
        })
    }

    async logout() {
        // Clear locally stored data that correlates to user and reload
        this.clearLocalUserInfo();
        window.location.reload();
    }

    async signUp(username, password, email) {
        const command = new SignUpCommand({
            ClientId: this.poolData.ClientId,
            Password: password,
            Username: email,
        })

        const result = await this.identityClient.send(command)
        const metaData = result.$metadata;

        if (metaData.httpStatusCode === 200) {
            const user = new User(
                username,
                email,
                null,
                false,
                null
            );

            return this.createUser(user)
            .then((creationResult) => {
                if (creationResult.success && !lodash.isEmpty(creationResult.Item)) {

                    const userInfo = creationResult.Item;
                    this.storeUserInfoLocally(userInfo);
                }

                return creationResult;
            });


        }

        return null;
    }

    async forgotPasswordCommand(email) {
        const command = new ForgotPasswordCommand({
            ClientId: this.poolData.ClientId,
            Username: email,
        })

        const result = await this.identityClient.send(command);
        const metaData = result.$metadata;
        return metaData
    }

    async getForgotPasswordResetCode(email) {
        const response = await this.internalApi.getUserByEmail(email)

        if (response.success && !lodash.isEmpty(response.Item)) {
            try {
                return await this.forgotPasswordCommand(email)
            } catch (error) {
                alert('Error sending reset code. Try again later')
            }
            
        } else {
            alert('User with that email does not exist')
        }
        return null
    }

    async confirmForgotPasswordCommand(email, code, newPassword) {
        const command = new ConfirmForgotPasswordCommand({
            ClientId: this.poolData.ClientId,
            Username: email,
            ConfirmationCode: code,
            Password: newPassword
        })

        try {
            const result = await this.identityClient.send(command);
            const metaData = result.$metadata;
            return metaData
        } catch (error) {
            alert(error.message)
            return null
        }
    }

    async resetPassword(email, code, newPassword) {
        try {
            const response = await this.confirmForgotPasswordCommand(email, code, newPassword)
            if (response.httpStatusCode === 200) {
                return true
            } 
        } catch (error) {
            console.log(error)
        }
        return false
    }

    storeUserInfoLocally(user) {
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('email', user.email);
        localStorage.setItem('username', user.username);
        localStorage.setItem('auth_token', JSON.stringify(user.auth_token));
    }

    async confirmSignUp(email, code, user_id) {
        const command = new ConfirmSignUpCommand({
            ClientId: this.poolData.ClientId,
            Username: email,
            ConfirmationCode: code
        });

        const result = await this.identityClient.send(command);

        const metaData = result.$metadata;
        if (metaData.httpStatusCode === 200) {
            console.log(email);
            return this.internalApi.getUserByEmail(email)
            .then((result) => {
                if (result.success && !lodash.isEmpty(result.Item)) {
                    const user = result.Item[0];

                    const id = user.id;
                    return this.internalApi.confirmUser(id)
                    .then((result) => {
                        if (result.success && !lodash.isEmpty(result.Item)) {
                            this.updateUser(result.Item);
                        }

                        return result;
                    })
                }
            })
        }
    }

    async resendConfirmationCode(email) {
        console.log(email)
        const command = new ResendConfirmationCodeCommand({
            ClientId: this.poolData.ClientId,
            Username: email
        })

        const result = await this.identityClient.send(command);

        const metaData = result.$metadata;
        if (metaData.httpStatusCode === 200) {
            return true;
        }

        return false;
    }

    createUser(user) {
        return this.internalApi.createUser(user)
    }

    getUser(user_id, email, username) {
        return this.internalApi.getUser(user_id);
    }
}

