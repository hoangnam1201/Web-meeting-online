export const ROOM_LOADING = "ROOM_LOADING";
export const ROOM_SETACCESSMEDIA = "ROOM_SETACCESSMEDIA";
export const ROOM_SHOWCHAT = "ROOM_SHOWCHAT";
export const ROOM_SHOWLOBBY = "ROOM_SHOWLOBBY";
export const ROOM_CHANGE = "ROOM_CANACCESS";

export const roomAccessMediaAction = (access) => {
  return {
    type: ROOM_SETACCESSMEDIA,
    payload: access,
  };
};

export const roomLoadingAction = () => {
  return {
    type: ROOM_LOADING,
  };
};

export const roomShowChatAction = (isShow) => {
  return {
    type: ROOM_SHOWCHAT,
    payload: isShow,
  };
};

export const roomShowLobbyAction = (isShow) => {
  return {
    type: ROOM_SHOWLOBBY,
    payload: isShow,
  };
};
