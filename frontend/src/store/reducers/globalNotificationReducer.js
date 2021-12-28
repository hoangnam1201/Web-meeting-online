export const globalnofificationReducer = (state = null, { type, payload }) => {
    switch (type) {
        case SET_GLOBALNOTIFICATION:
            return { ...payload }
        default:
            return state
    }
}

const SET_GLOBALNOTIFICATION = 'SET_GLOBALNOTIFICATION';
export const setGlobalNotification = (icon, msg) => {
    return {
        type: SET_GLOBALNOTIFICATION,
        payload: { icon, msg }
    }
}
