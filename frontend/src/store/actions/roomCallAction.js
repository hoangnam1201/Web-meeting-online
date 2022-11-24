import Connection from "../../services/connection";

export const ROOMCALL_SETACCESSMEDIA = "ROOMCALL_SETACCESSMEDIA";
export const ROOMCALL_SHOWCHAT = "ROOMCALL_SHOWCHAT";
export const ROOMCALL_SHOWLOBBY = "ROOMCALL_SHOWLOBBY";
export const ROOMCALL_CHANGE = "ROOMCALL_CANACCESS";
export const ROOMCALL_SETSOCKET = "ROOMCALL_SETSOCKET";
export const ROOMCALL_SETPEERID = "ROOMCALL_SETPEERID";
export const ROOMCALL_SETSHARING = "ROOMCALL_SETSHARING";
export const ROOMCALL_SETROOMINFO = "ROOMCALL_SETROOMINFO";
export const ROOMCALL_ADDREQUEST = "ROOMCALL_ADDREQUEST";
export const ROOMCALL_JOINLOADING = 'ROOMCALL_JOINLOADING';
export const ROOMCALL_CHATLOADING = 'ROOMCALL_CHATLOADING';
export const ROOMCALL_SETSELETEDTABLE = 'ROOMCALL_SETSELETEDTABLE';
export const ROOMCALL_SETREQUESTLOADING = 'ROOMCALL_SETREQUESTLOADING';
export const ROOMCALL_SETREQUEST = 'ROOMCALL_SETREQUEST';
export const ROOMCALL_SHOWQUIZS = 'ROOMCALL_SHOWQUIZLIST';

const setRequestLoading = (isloading) => {
  return {
    type: ROOMCALL_SETREQUESTLOADING,
    payload: isloading
  }
}

export const roomCallSetSharingAction = (isShare) => {
  return {
    type: ROOMCALL_SETSHARING,
    payload: isShare
  }
}

export const roomCallSetRequestsAction = (requests) => {
  return {
    type: ROOMCALL_SETREQUEST,
    payload: requests
  }
}

export const roomSetSocketAction = (socket) => {
  return {
    type: ROOMCALL_SETSOCKET,
    payload: socket,
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

export const roomShowChatAction = (isShow) => {
  return {
    type: ROOMCALL_SHOWCHAT,
    payload: isShow,
  };
};

export const roomShowQuizsAction = (isShow) => {
  return {
    type: ROOMCALL_SHOWQUIZS,
    payload: isShow,
  };
}

export const roomShowLobbyAction = (isShow) => {
  return {
    type: ROOMCALL_SHOWLOBBY,
    payload: isShow,
  };
};

export const roomCallSetPeerId = (id) => {
  return {
    type: ROOMCALL_SETPEERID,
    payload: id
  }
}

export const setSeletedTable = (id) => {
  return {
    type: ROOMCALL_SETSELETEDTABLE,
    payload: id
  }
}

export const roomCallSetJoinLoading = (isloading) => {
  return {
    type: ROOMCALL_JOINLOADING,
    payload: isloading
  }
}

export const roomCallSetChatLoading = (isloading) => {
  return {
    type: ROOMCALL_CHATLOADING,
    payload: isloading
  }
}

export const roomCallJoinTable = (id, mediaStatus) => {
  return (dispatch, getState) => {
    const roomCall = getState().roomCall;
    dispatch(roomCallSetJoinLoading(true))
    Connection.stopShareTrack()
    roomCall.socket.emit(
      "table:join",
      { tableId: id },
      roomCall.myId,
      mediaStatus,
      () => {
        dispatch(roomCallSetJoinLoading(false))
      }
    );
  }
}

export const roomCallSendMessage = ({ msgString, files }) => {
  return (dispatch, getState) => {
    const roomCall = getState().roomCall;
    dispatch(roomCallSetChatLoading(true))
    roomCall.socket.emit(
      "room:send-message",
      { msgString, files },
      () => {
        dispatch(roomCallSetChatLoading(false))
      }
    );
  }
}

export const roomCallCloseRoomAction = (callback) => {
  return (dispatch, getState) => {
    const roomCall = getState().roomCall;
    roomCall.socket.emit(
      "room:close",
      () => {
        callback()
      }
    );
  }
}

export const roomCallSendTableMessage = ({ msgString, files }) => {
  return (dispatch, getState) => {
    const roomCall = getState().roomCall;
    dispatch(roomCallSetChatLoading(true))
    roomCall.socket.emit(
      "table:send-message",
      { msgString, files },
      () => {
        dispatch(roomCallSetChatLoading(false))
      }
    );
  }
}

export const roomCallResponceRequests = (requestIds, isAccept) => {
  return (dispatch, getState) => {
    const roomCall = getState().roomCall;
    dispatch(setRequestLoading(true));
    roomCall.socket.emit("room:accept-request", requestIds, isAccept)
  }
}