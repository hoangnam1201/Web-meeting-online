const initState = {
    loading: false,
    items: []
}

export const roomMessageReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case ROOMMESSAGES_LOADING:
            return { ...state, loading: true };
        case ROOMMESSAGES_SET:
            return { items: [...payload], loading: false};
        default:
            return { ...state }
    }
}

export const ROOMMESSAGES_SET = 'ROOMMESSAGES_SET';
export const ROOMMESSAGES_LOADING = 'ROOMMESSAGES_LOADING';