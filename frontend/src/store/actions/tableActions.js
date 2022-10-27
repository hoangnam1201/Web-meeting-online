import {
  createTableAPI,
  deleteTableAPI,
  getTablesByRoomAndFloorAPI,
  updateTableAPI,
} from "../../api/table.api";

export const TABLE_REQUEST = "TABLE_REQUEST";
export const TABLE_SUCCESS = "TABLE_SUCCESS";
export const TABLE_ERROR = "TABLE_ERROR";
export const TABLE_SELECT_FLOOR = "TABLE_SELECT-FLOOR";
export const TABLE_SET_SELETED_TABLES = 'TABLE_SET_SELETED_TABLES';

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

const tableSetSelectedTables = (ids) => {
  return {
    type: TABLE_SET_SELETED_TABLES,
    payload: ids
  }
}

const tableError = (msg) => {
  return {
    type: TABLE_ERROR,
    payload: msg,
  };
};

const tableSelectFloor = (floor) => {
  return {
    type: TABLE_SELECT_FLOOR,
    payload: floor,
  };
};

export const tableSelectTableAction = (id) => {
  return (dispatch, getState) => {
    const tableState = getState().tables;
    let selectedTables = []
    const index = tableState.selectedTables.indexOf(id);

    if (index !== -1) {
      tableState.selectedTables.splice(index, 1);
      selectedTables = [...tableState.selectedTables];
    } else
      selectedTables = [...tableState.selectedTables, id];
    dispatch(tableSetSelectedTables(selectedTables));
  }
}

export const tableSetAllSelectedTablesAction = () => {
  return (dispatch, getState) => {
    const { selectedTables, items } = getState().tables;
    if (selectedTables.length)
      return dispatch(tableSetSelectedTables([]));
    return dispatch(tableSetSelectedTables(items.map(t => t._id)));
  }
}

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
      dispatch(tableSetSelectedTables([]));
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

export const updateTableAction = (data, roomId) => {
  return async (dispatch, getState) => {
    dispatch(tableRequest());
    const tables = getState().tables;
    try {
      await updateTableAPI(tables.selectedTables, data);
      dispatch(getTabelsAction(roomId, tables.currentFloor));
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
