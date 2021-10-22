import * as actionTypes from "./constant";

export const actSocketConnectRoom = (payload) => {
  return {
    type: actionTypes.SOCKET_CONNECT,
    payload,
  };
};

export const actSocketDisconnectRoom = () => {
  return {
    type: actionTypes.SOCKET_DISCONNECT,
  };
};
