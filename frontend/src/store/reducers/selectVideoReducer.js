import { SELECTEDVIDEO_REMOVE, SELECTEDVIDEO_SET } from "../actions/selectedVideoAction";

const initState = null;

export const selectedVideoReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case SELECTEDVIDEO_SET:
            return payload
        case SELECTEDVIDEO_REMOVE:
            return null
        default:
            return state
    }
}
