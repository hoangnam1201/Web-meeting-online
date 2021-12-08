import { createTableAPI, deleteTableAPI, getTablesAPI } from "../../api/table.api";

export const TABLE_REQUEST = 'TABLE_REQUEST';
export const TABLE_SUCCESS = 'TABLE_SUCCESS';
export const TABLE_ERROR = 'TABLE_ERROR';

const tableRequest = () => {
    return {
        type: TABLE_REQUEST
    }
}

const tableSuccess = (tables) => {
    return {
        type: TABLE_SUCCESS,
        payload: tables
    }
}

const tableError = (msg) => {
    return {
        type: TABLE_SUCCESS,
        payload: msg
    }
}

export const getTabelsAction = (roomId) => {
    return async (dispatch) => {
        dispatch(tableRequest());
        try {
            const res = await getTablesAPI(roomId);
            dispatch(tableSuccess(res.data));
        } catch (err) {
            console.log(err)
            dispatch(tableError(err.response?.data?.err));
        }
    }
}

export const addTableAction = (table) => {
    return async (dispatch) => {
        dispatch(tableRequest());
        try {
            await createTableAPI(table);
            dispatch(getTabelsAction(table.room));
        } catch (err) {
            dispatch(tableError(err.response?.data?.err));
        }
    }
}

export const removeTableAction = (id, roomId) => {
    return async (dispatch) => {
        dispatch(tableRequest());
        try {
            await deleteTableAPI(id);
            dispatch(getTabelsAction(roomId));
        } catch (err) {
            dispatch(tableError(err.response?.data?.err));
        }
    }
}