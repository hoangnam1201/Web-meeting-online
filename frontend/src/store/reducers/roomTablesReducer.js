const initState = {
    loading: false,
    items: []
};

export const roomTablesReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case ROOMTABLE_SET:
            return { loading: false, items: [...payload] }
        case ROOMTABLE_LOADING:
            return { ...state, loading: true }
        default:
            return { ...state }
    }
}

export const ROOMTABLE_SET = 'ROOMTABLE_SET';
export const ROOMTABLE_LOADING = 'ROOMTABLE_LOADING';