import { combineReducers } from "redux";
import { listRoomReducer } from "../components/MyEvent/modules/reducer";
import { listTableReducer } from "../components/RoomDetail/modules/reducer";

export const rootReducer = combineReducers({
  listRoomReducer,
  listTableReducer,
});
