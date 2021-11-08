import { combineReducers } from "redux";
import { listRoomReducer } from "../components/MyEvent/modules/reducer";
import { listTableReducer, mediaReducer, streamReducer } from "../components/RoomDetail/modules/reducer";
import { socketRoomReducer } from "../components/CheckMedia/modules/reducer";
import { userReducer } from "./userInfoReducer";

export const rootReducer = combineReducers({
  userReducer,
  listRoomReducer,
  listTableReducer,
  socketRoomReducer,
  streamReducer,
  mediaReducer
});
