export const ROOMCALL_LOADING = "ROOMCALL_LOADING";
export const ROOMCALL_SETACCESSMEDIA = "ROOMCALL_SETACCESSMEDIA";
export const ROOMCALL_SHOWCHAT = "ROOMCALL_SHOWCHAT";
export const ROOMCALL_SHOWLOBBY = "ROOMCALL_SHOWLOBBY";
export const ROOMCALL_CHANGE = "ROOMCALL_CANACCESS";
export const ROOMCALL_SETSOCKET = "ROOMCALL_SETSOCKET";
export const ROOMCALL_SETROOMINFO = "ROOMCALL_SETROOMINFO";
export const ROOMCALL_ADDREQUEST = "ROOMCALL_ADDREQUEST";
export const ROOMCALL_REMOVEREQUEST = "ROOMCALL_REMOVEREQUEST";

export const roomSetSocketAction = (socket) => {
  return {
    type: ROOMCALL_SETSOCKET,
    payload: socket,
  };
};

export const roomRemoveRequestAction = (requestId) => {
  return {
    type: ROOMCALL_REMOVEREQUEST,
    payload: requestId,
  };
};

export const roomAddRequestAction = (request) => {
  return {
    type: ROOMCALL_ADDREQUEST,
    payload: request,
  };
};

export const roomSetRoomInfoAction = (room) => {
  return {
    type: ROOMCALL_SETROOMINFO,
    payload: room,
  };
};

export const roomAccessMediaAction = (access) => {
  return {
    type: ROOMCALL_SETACCESSMEDIA,
    payload: access,
  };
};

export const roomLoadingAction = () => {
  return {
    type: ROOMCALL_LOADING,
  };
};

export const roomShowChatAction = (isShow) => {
  return {
    type: ROOMCALL_SHOWCHAT,
    payload: isShow,
  };
};

export const roomShowLobbyAction = (isShow) => {
  return {
    type: ROOMCALL_SHOWLOBBY,
    payload: isShow,
  };
};
