import Connection from "../../services/connection";
import { toastSuccess, toastText } from "../../services/toastService";

export const CALLALL_SETHOSTSTREAM = 'CALLALL_SETHOSTSTREAM';
export const CALLALL_SETHOSTSHARESTREAM = 'CALLALL_SETHOSTSHARESTREAM';
export const CALLALL_SETCALLALL = 'CALLALL_SETCALLALL'
export const CALLALL_LOADING = 'CALLALL_LOADING'

const callallLoading = () => ({
  type: CALLALL_LOADING
})

export const callAllSetHostShareStream = (streamData) => (
  {
    type: CALLALL_SETHOSTSHARESTREAM,
    payload: streamData
  })

export const callAllSetHostStream = (streamData) => ({
  type: CALLALL_SETHOSTSTREAM,
  payload: streamData
})


export const callAllSetIsCallAll = (isCallAll) => ({
  type: CALLALL_SETCALLALL,
  payload: isCallAll
})

export const callAllAction = () => {
  return (dispatch) => {
    dispatch(callallLoading())
    Connection.stopShareTrack();
    Connection.socket.emit('room:call-all', Connection.myID, Connection.myStream.media, (data) => {
      toastSuccess('call all success');
      dispatch(callAllSetIsCallAll(data))
    })
  }
}

export const closeCallAllAction = () => {
  return (dispatch) => {
    Connection.stopShareTrack()
    dispatch(callallLoading())
    Connection.socket.emit('room:close-call-all', Connection.myID, (data) => {
      toastText('close call all success', 'dark');
      dispatch(callAllSetIsCallAll(data))
    })
  }
}