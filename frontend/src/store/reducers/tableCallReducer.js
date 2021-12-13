import { TABLE_CHANGEMEDIA, TABLE_PINSTREAM, TABLE_USERCLEAER, TABLE_USERJOIN, TABLE_USERLEAVE } from "../actions/tableCallAction"

const initState = {
    streams: [],
    pin: null
}

export const tableCallReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case TABLE_USERJOIN:
            const streams = state.streams.filter(s => payload.user._id !== s.user._id)
            return {
                ...state,
                streams: [...streams, payload]
            }
        case TABLE_USERLEAVE:
            if (state.pin)
                state.pin = state.pin.user._id === payload ? null : state.pin
            return {
                ...state,
                streams: state.streams.filter(s => {
                    console.log(s, payload)
                    return payload !== s.user._id
                }),
            }
        case TABLE_USERCLEAER:
            return {
                streams: []
            }
        case TABLE_PINSTREAM:
            return {
                ...state,
                pin: payload
            }
        case TABLE_CHANGEMEDIA:
            const stream = state.streams.find(s => payload.userId === s.user._id);
            if (stream) {
                if (state.pin && state.pin.user._id === payload.userId) {
                    state.pin.media = payload.media
                }
                stream.media = payload.media;
                return { ...state }
            }
            return state
        default:
            return state
    }
}