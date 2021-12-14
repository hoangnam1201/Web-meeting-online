const initState = null;

export const SET_SELECTEDVIDEO = 'SET_SELECTEDVIDEO'

export const selectedVideoReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case SET_SELECTEDVIDEO:
            if (payload)
                return { ...payload }
            return null
        default:
            return state
    }
}
