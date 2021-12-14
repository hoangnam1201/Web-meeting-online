import { ROOM_LOADING, ROOM_SHOWCHAT } from "../actions/roomCallAction"

const initState = {
    loading: false,
    showChat: false,
}

export const roomCallReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case ROOM_SHOWCHAT:
            return { ...state, showChat: payload };
        case ROOM_LOADING:
            return { ...state, loading: true };
        default:
            return state
    }
}