const initState = {
    loading: false,
    items: []
}

export const tableMessageReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case TABLEMESSAGES_LOADING:
            return { ...state, loading: true };
        case TABLEMESSAGES_SET:
            return { items: [...payload], loading: false};
        default:
            return { ...state }
    }
}

export const TABLEMESSAGES_SET = 'TABLEMESSAGES_SET';
export const TABLEMESSAGES_LOADING = 'TABLEMESSAGES_LOADING';