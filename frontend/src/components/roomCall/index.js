import React, { useEffect, useRef, useState } from "react";
import Connection from "../../services/connection";
import CheckMedia from "./checkMedia";
import RoomDetail from "./roomDetail";
import { useHistory } from "react-router-dom";

const RoomCall = () => {
  const connection = useRef(null);
  const [roomMessages, setRoomMessage] = useState([]);
  const [tableMessages, setTableMessage] = useState([]);
  const [streamDatas, setStreamDatas] = useState({});
  const [myStream, setMyStream] = useState({ stream: null });
  const [canAccess, setCanAccess] = useState(false);
  const [access, setAccess] = useState(false);
  const [roomTables, setRoomTables] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const history = useHistory();
  const [userJoined, setUserJoined] = useState([]);
  const [userRequests, setUserRequests] = useState({});
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    connection.current = new Connection({ updateInstance, history });
    connection.current.initMyStream();
    return () => {
      connection.current.destoryDisconnect();
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
      case "info":
        return setRoomInfo(data);
      case "joiners":
        return setUserJoined(data);
      case "join-err":
        return setJoinError(data);
      case 'requests':
        return setUserRequests(data);
      default:
        return;
    }
  };

  return (
    <div>
      {!access ? (
        <CheckMedia
          connection={connection}
          canAccess={canAccess}
          myStream={myStream}
          joinError={joinError}
        />
      ) : (
        <RoomDetail
          connection={connection}
          roomInfo={roomInfo}
          streamDatas={streamDatas}
          roomMessages={roomMessages}
          myStream={myStream}
          roomTables={roomTables}
          tableMessages={tableMessages}
          userJoined={userJoined}
          userRequests={userRequests}
        />
      )}
    </div>
  );
};

export default RoomCall;
