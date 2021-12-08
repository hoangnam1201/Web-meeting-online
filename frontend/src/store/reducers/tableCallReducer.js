import { TABLE_CHANGEMEDIA, TABLE_USERCLEAER, TABLE_USERJOIN, TABLE_USERLEAVE } from "../actions/tableCallAction"

const initState = {
    streams: [],
}

export const tableCallReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case TABLE_USERJOIN:
            const streams = state.streams.filter(s => payload.user._id !== s.user._id)
            return {
                streams: [...streams, payload]
            }
        case TABLE_USERLEAVE:
            return {
                streams: state.streams.filter(s => payload !== s.user._id)
            }
        case TABLE_USERCLEAER:
            return {
                streams: []
            }
        case TABLE_CHANGEMEDIA:
            console.log('--------------change media')
            return {
                streams: [...state.streams]
            }
        default:
            return { ...state }
    }
}