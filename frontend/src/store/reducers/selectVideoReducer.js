import { SET_SELECTEDVIDEO } from "../actions/selectedVideoAction";

const initState = null;

export const selectedVideoReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case SET_SELECTEDVIDEO:
            return payload
        default:
            return state
    }
}
