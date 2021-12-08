import { TABLE_ERROR, TABLE_REQUEST, TABLE_SUCCESS } from "../actions/tableActions"

const initState = {
    loading: false,
    error: null,
    items: []
}

export const TablesReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case TABLE_REQUEST:
            return { ...state, loading: true };
        case TABLE_SUCCESS:
            return { ...state, loading: false, items: payload };
        case TABLE_ERROR:
            return { ...state, loading: false, error: payload };
        default:
            return { ...state }
    }
}