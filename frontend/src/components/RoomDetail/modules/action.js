import * as actionTypes from "./constant";
import axios from "axios";
import { Cookies } from 'react-cookie';

export const actGetTable = (roomID) => {
  const auth = new Cookies().get('u_auth');
  return (dispatch) => {
    dispatch(actGetTableRequest());
    axios({
      url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/table/get-by-room/${roomID}`,
      method: "GET",
      headers: {
        Authorization: `token ${auth.accessToken}`,
      },
    })
      .then((result) => {
        dispatch(actGetTableSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetTableFailed(error));
      });
  };
};

const actGetTableRequest = () => {
  return {
    type: actionTypes.GET_TABLE_REQUEST,
  };
};

const actGetTableSuccess = (payload) => {
  return {
    type: actionTypes.GET_TABLE_SUCCESS,
    payload,
  };
};

const actGetTableFailed = (error) => {
  return {
    type: actionTypes.GET_TABLE_FAILED,
    payload: error,
  };
};
export const actGetMember = () => {
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  return (dispatch) => {
    dispatch(actGetMemberRequest());
    axios({
      url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/room/invited-room`,
      method: "GET",
      headers: {
        Authorization: `token ${accessToken.accessToken}`,
      },
    })
      .then((result) => {
        dispatch(actGetMemberSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetMemberFailed(error));
      });
  };
};

const actGetMemberRequest = () => {
  return {
    type: actionTypes.GET_MEMBER_REQUEST,
  };
};

const actGetMemberSuccess = (payload) => {
  return {
    type: actionTypes.GET_MEMBER_SUCCESS,
    payload,
  };
};

const actGetMemberFailed = (error) => {
  return {
    type: actionTypes.GET_MEMBER_FAILED,
    payload: error,
  };
};

// media action
export const actTurnOnVideo = () => {
  return {
    type: actionTypes.MEDIA_TURN_ON_VIDEO
  }
}

export const actTurnOffVideo = () => {
  return {
    type: actionTypes.MEDIA_TURN_OFF_VIDEO
  }
}

export const actTurnOnAudio = () => {
  return {
    type: actionTypes.MEDIA_TURN_ON_AUDIO
  }
}

export const actTurnOffAudio = () => {
  return {
    type: actionTypes.MEDIA_TURN_OFF_AUDIO
  }
}


//stream action
export const actSetStream = (payload) => {
  return {
    type: actionTypes.SET_STREAM,
    payload
  }
}

export const actStopStream = () => {
  return {
    type: actionTypes.STOP_STREAM,
  }
}
