import * as actionTypes from "./constant";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const listTableReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case actionTypes.GET_TABLE_REQUEST:
      state.loading = true;
      state.data = null;
      state.error = null;
      return { ...state };
    case actionTypes.GET_TABLE_SUCCESS:
      state.loading = false;
      state.data = payload;
      state.error = null;
      return { ...state };
    case actionTypes.GET_TABLE_FAILED:
      state.loading = false;
      state.data = null;
      state.error = payload;
      return { ...state };
    default:
      return { ...state };
  }
};


export const listMemberReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case actionTypes.GET_MEMBER_REQUEST:
      state.loading = true;
      state.data = null;
      state.error = null;
      return { ...state };
    case actionTypes.GET_MEMBER_SUCCESS:
      state.loading = false;
      state.data = payload;
      state.error = null;
      return { ...state };
    case actionTypes.GET_MEMBER_FAILED:
      state.loading = false;
      state.data = null;
      state.error = payload;
      return { ...state };
    default:
      return { ...state };
  }
};

const mediaInitialState = {
  audio: true,
  video: true,
}

export const mediaReducer = (state = mediaInitialState, { payload, type }) => {
  switch (type) {
    case actionTypes.MEDIA_TURN_OFF_VIDEO:
      return { ...state, video: false };
    case actionTypes.MEDIA_TURN_ON_VIDEO:
      return { ...state, video: true };
    case actionTypes.MEDIA_TURN_ON_AUDIO:
      return { ...state, audio: true };
    case actionTypes.MEDIA_TURN_OFF_AUDIO:
      return { ...state, audio: false };
    default:
      return { ...state };
  }
}

const streamInitialState = {
  stream: null
}

export const streamReducer = (state = streamInitialState, { payload, type }) => {
  switch (type) {
    case actionTypes.SET_STREAM:
      if (state.stream)
        state.stream.getTracks().forEach(track => track.stop());
      return { stream: payload };
    case actionTypes.STOP_STREAM:
      if (state.stream)
        state.stream.getTracks().forEach(track => track.stop());
      return { ...state }
    default:
      return { ...state };
  }
}