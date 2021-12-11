import { ROOM_CHANGE, ROOM_LOADING, ROOM_SETACCESSMEDIA, ROOM_SHOWCHAT } from "../actions/roomCallAction"

const initState = {
    loading: false,
    accessMedia: false,
    canAccessMedia: false,
    showChat: false,
}

export const roomCallReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case ROOM_SHOWCHAT:
            return { ...state, showChat: payload };
        case ROOM_LOADING:
            return { ...state, loading: true };
        case ROOM_SETACCESSMEDIA:
            return {
                ...state,
                loading: false,
                accessMedia: payload
            };
        case ROOM_CHANGE:
            return {
                ...state,
            }
        default:
            return { ...state }
    }
}