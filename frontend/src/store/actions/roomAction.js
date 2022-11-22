import { banRoomAPI, getAllRoomAPI, unbanRoomAPI } from "../../api/room.api";

export const ROOM_REQUEST = "ROOM_REQUEST";
export const ROOM_SUCCESS = "ROOM_SUCCESS";
export const ROOM_ERROR = "ROOM_ERROR";

const roomRequest = () => {
  return {
    type: ROOM_REQUEST,
  };
};

const roomError = (err) => {
  return {
    type: ROOM_ERROR,
    payload: err,
  };
};

const roomSuccess = (ROOM) => {
  return {
    type: ROOM_SUCCESS,
    payload: ROOM,
  };
};

export const getRoomPagingAction = (pageIndex, ownerId) => {
  return async (dispatch) => {
    dispatch(roomRequest());
    try {
      const pageSize = 10;
      const res = await getAllRoomAPI(pageSize, pageIndex, ownerId);
      const { records, count = 0 } = res.data;
      dispatch(
        roomSuccess({
          items: records,
          totalPages: Math.round(count / pageSize),
          currentPage: pageIndex,
        })
      );
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(roomError(err.response));
        return;
      }
      dispatch(roomError("Error network"));
    }
  };
};

export const banRoomAction = (roomId, pageIndex, callback) => {
  return async (dispatch) => {
    dispatch(roomRequest());
    try {
      await banRoomAPI(roomId);
      dispatch(getRoomPagingAction(pageIndex));
      callback && callback();
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(roomError(err.response));
        return;
      }
      dispatch(roomError("Error network"));
    }
  };
};

export const unbanRoomAction = (roomId, pageIndex, callback) => {
  return async (dispatch) => {
    dispatch(roomRequest());
    try {
      await unbanRoomAPI(roomId);
      dispatch(getRoomPagingAction(pageIndex));
      callback && callback();
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(roomError(err.response));
        return;
      }
      dispatch(roomError("Error network"));
    }
  };
};