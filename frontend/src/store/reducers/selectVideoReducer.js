import { SELECTEDVIDEO_REMOVE, SELECTEDVIDEO_SET } from "../actions/selectedVideoAction";

const initState = null;

export const selectedVideoReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case SELECTEDVIDEO_SET:
            if (!state || !payload)
                return payload
            return state
        case SELECTEDVIDEO_REMOVE:
            if (state === payload)
                return null
            return state
        default:
            return state
    }
}
