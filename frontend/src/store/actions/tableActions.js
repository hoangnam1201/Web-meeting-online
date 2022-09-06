import {
  createTableAPI,
  deleteTableAPI,
  getTablesAPI,
  getTablesByRoomAndFloorAPI,
} from "../../api/table.api";

export const TABLE_REQUEST = "TABLE_REQUEST";
export const TABLE_SUCCESS = "TABLE_SUCCESS";
export const TABLE_ERROR = "TABLE_ERROR";
export const TABLE_SELECT_FLOOR = "TABLE_SELECT-FLOOR";

const tableRequest = () => {
  return {
    type: TABLE_REQUEST,
  };
};

const tableSuccess = (tables) => {
  return {
    type: TABLE_SUCCESS,
    payload: tables,
  };
};

const tableError = (msg) => {
  return {
    type: TABLE_SUCCESS,
    payload: msg,
  };
};

const tableSelectFloor = (floor) => {
  return {
    type: TABLE_SELECT_FLOOR,
    payload: floor,
  };
};

export const tableSelectFloorAction = (roomId, floor) => {
  return async (dispatch) => {
    dispatch(tableSelectFloor(floor));
    dispatch(getTabelsAction(roomId, floor));
  };
};

export const getTabelsAction = (roomId, floor) => {
  return async (dispatch) => {
    dispatch(tableRequest());
    try {
      const res = await getTablesByRoomAndFloorAPI(roomId, floor);
      dispatch(tableSuccess(res.data));
    } catch (err) {
      console.log(err);
      dispatch(tableError(err.response?.data?.err));
    }
  };
};

export const addTableAction = (table) => {
  return async (dispatch) => {
    dispatch(tableRequest());
    try {
      await createTableAPI(table);
      dispatch(getTabelsAction(table.room, table.floor));
    } catch (err) {
      dispatch(tableError(err.response?.data?.err));
    }
  };
};

export const removeTableAction = (id, roomId) => {
  return async (dispatch, getState) => {
    dispatch(tableRequest());
    try {
      await deleteTableAPI(id);
      dispatch(getTabelsAction(roomId, getState().tables.currentFloor));
    } catch (err) {
      dispatch(tableError(err.response?.data?.err));
    }
  };
};
