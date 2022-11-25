import { combineReducers } from "redux";
import { listRoomReducer } from "../../components/MyEvent/modules/reducer";
import { userReducer } from "./userInfoReducer";
import { roomCallReducer } from "./roomCallReducer";
import { selectedVideoReducer } from "./selectVideoReducer";
import { notifyMessageReducer } from "./notifyMessageReducer";
import { TablesReducer } from "./tablesReducer";
import { globalnofificationReducer } from "./globalNotificationReducer";
import { quizReducer } from "./quizReducer";
import { questionReducer } from "./questionReducer";
import { userManageReducer } from "./userManageReducer";
import { roomManageReducer } from "./roomManageReducer";
import { submissionReducer } from './submissionReducer';
import { scoreReducer } from './scoreReducer';

export const rootReducer = combineReducers({
  userReducer,
  listRoomReducer,
  submissionReducer,
  roomCall: roomCallReducer,
  selectedVideo: selectedVideoReducer,
  tables: TablesReducer,
  globalNofification: globalnofificationReducer,
  notifyMessageReducer,
  scoreReducer,
  quizReducer,
  questionReducer,
  userManageReducer,
  roomManageReducer,
});
