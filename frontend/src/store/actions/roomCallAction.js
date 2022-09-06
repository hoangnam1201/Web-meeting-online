export const ROOMCALL_LOADING = "ROOMCALL_LOADING";
export const ROOMCALL_SETACCESSMEDIA = "ROOMCALL_SETACCESSMEDIA";
export const ROOMCALL_SHOWCHAT = "ROOMCALL_SHOWCHAT";
export const ROOMCALL_SHOWLOBBY = "ROOMCALL_SHOWLOBBY";
export const ROOMCALL_CHANGE = "ROOMCALL_CANACCESS";

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
