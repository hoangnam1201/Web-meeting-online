const initState = {
    stream: null,
}

export const myStreamReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case MYSTREAM_SET:
            console.log('render stream', payload);
            return { ...state, stream: payload };
        default:
            return state
    }
}

export const MYSTREAM_SET = 'MYSTREAM_SET';