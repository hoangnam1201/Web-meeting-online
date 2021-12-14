import { combineReducers } from "redux";
import { listRoomReducer } from "../../components/MyEvent/modules/reducer";
import { userReducer } from "./userInfoReducer";
import { roomCallReducer } from "./roomCallReducer";
import { selectedVideoReducer } from "./selectVideoReducer";

export const rootReducer = combineReducers({
  userReducer,
  listRoomReducer,
  roomCall: roomCallReducer,
  selectedVideo: selectedVideoReducer
});
