export const SET_USER_INFO = 'user/SET_USER_INFO';
export const REMOVE_USER_INFO = 'user/SET_USER_INFO';

export const actionSetUserInfo = (payload) => {
    return {
        type: SET_USER_INFO,
        payload
    }
}

export const actionRemoveUserInfo = () => {
    return {
        type: SET_USER_INFO
    }
}