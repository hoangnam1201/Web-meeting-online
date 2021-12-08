import { combineReducers } from "redux";
import { listRoomReducer } from "../../components/MyEvent/modules/reducer";
import { socketRoomReducer } from "../../components/CheckMedia/modules/reducer";
import { userReducer } from "./userInfoReducer";
import { roomCallReducer } from "./roomCallReducer";
import { TablesReducer } from "./tablesReducer";
import { tableCallReducer } from "./tableCallReducer";
import { roomTablesReducer } from "./roomTablesReducer";
import { roomMessageReducer } from "./roomMessagesReducer";
import { tableMessageReducer } from "./tableMessagesReducer";
import { myStreamReducer } from "./myStreamReducer";

export const rootReducer = combineReducers({
  userReducer,
  listRoomReducer,
  // listTableReducer,
  // streamReducer,
  // mediaReducer,
  socketRoomReducer,
  roomCall: roomCallReducer,
  myStream: myStreamReducer,
  roomTables: roomTablesReducer,
  roomMessages: roomMessageReducer,
  tableMessages: tableMessageReducer,
  tableCall: tableCallReducer,
  tables: TablesReducer
});
