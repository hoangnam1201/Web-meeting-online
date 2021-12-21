import { ROOM_LOADING, ROOM_SHOWCHAT, ROOM_SHOWLOBBY } from "../actions/roomCallAction"

const initState = {
    loading: false,
    showChat: false,
    showLobby: false,
}

export const roomCallReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case ROOM_SHOWCHAT:
            return { ...state, showChat: payload };
        case ROOM_LOADING:
            return { ...state, loading: true };
        case ROOM_SHOWLOBBY:
            return { ...state, showLobby: payload };
        default:
            return state
    }
}