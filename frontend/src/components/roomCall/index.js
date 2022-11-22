import React, { useEffect, useRef, useState } from "react";
import Connection from "../../services/connection";
import CheckMedia from "./checkMedia";
import RoomDetail from "./roomDetail";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../../store/actions/userInfoAction";

const RoomCall = () => {
  const connectionRef = useRef(null);
  const dispatch = useDispatch();
  const [roomMessages, setRoomMessage] = useState([]);
  const [tableMessages, setTableMessage] = useState([]);
  const [streamDatas, setStreamDatas] = useState({});
  const [myStream, setMyStream] = useState({ stream: null });
  const [canAccess, setCanAccess] = useState(false);
  const [access, setAccess] = useState(false);
  const [roomTables, setRoomTables] = useState([]);
  const [currentFloor, setCurrentFloor] = useState(null);
  const history = useHistory();
  const [userJoined, setUserJoined] = useState([]);
  const [userRequests, setUserRequests] = useState({});
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    // connectionRef.current = new Connection({ updateInstance, history });
    Connection.staticContructor({ updateInstance })
    Connection.initMyStream();
    dispatch(getUserInfo());
    return () => {
      // connectionRef.current.destoryDisconnect();
    };
  }, []);

  const updateInstance = (key, data) => {
    switch (key) {
      case "room:messages":
        return setRoomMessage(data);
      case "table:messages":
        return setTableMessage(data);
      case "streamDatas":
        return setStreamDatas(data);
      case "myStream":
        return setMyStream(data);
      case "canAccess":
        return setCanAccess(data);
      case "access":
        return setAccess(data);
      case "tables":
        return setRoomTables(data);
      case "joiners":
        return setUserJoined(data);
      case "join-err":
        return setJoinError(data);
      case "requests":
        return setUserRequests(data);
      case "currentFloor":
        return setCurrentFloor(data);
      default:
        return;
    }
  };

  return (
    <div>
      {!access ? (
        <CheckMedia
          canAccess={canAccess}
          myStream={myStream}
          joinError={joinError}
        />
      ) : (
        <RoomDetail
          connection={connectionRef}
          streamDatas={streamDatas}
          roomMessages={roomMessages}
          myStream={myStream}
          roomTables={roomTables}
          tableMessages={tableMessages}
          userJoined={userJoined}
          userRequests={userRequests}
          currentFloor={currentFloor}
        />
      )}
    </div>
  );
};

export default RoomCall;
