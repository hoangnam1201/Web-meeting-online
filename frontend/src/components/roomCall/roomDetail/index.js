import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoTableContainer from "../videoTableContainer";
import ChatBox from "../chatBox";
import Connection from "../../../services/connection";
import Present from "../present";
import LobbyUser from "../../Lobby";
import Toolbar from "../toolbar";
import PinVideo from "./pinVideo";
import ListFloor from "./listFloor";
import ListTable from "./listTable";
import { roomShowLobbyAction } from "../../../store/actions/roomCallAction";

const RoomDetail = ({
  connection,
  roomTables,
  roomMessages,
  tableMessages,
  streamDatas,
  roomInfo,
  myStream,
  userJoined,
  userRequests,
  currentFloor,
}) => {
  const roomCall = useSelector((state) => state.roomCall);
  const dispatch = useDispatch();
  const [mediaStatus, setMediaStatus] = useState({
    audio: false,
    video: false,
  });

  useEffect(() => {
    const media = Connection.getMediaStatus(myStream.stream);
    setMediaStatus(media);
    connection.current.replaceStream();
    roomCall.socket.emit(
      "change-media",
      media,
      roomCall.roomInfo?.isPresent === true ? "present" : "table"
    );
  }, [myStream]);

  return (
    <div
      onClick={() => dispatch(roomShowLobbyAction(false))}
      className="min-h-screen relative bg-blue-50 pb-20"
    >
      {!roomCall?.roomInfo?.isPresent && (
        <>
          <VideoTableContainer
            className="sticky z-10 justify-center w-full overflow-x-auto top-4 scroll-none"
            streamDatas={streamDatas}
            myStream={myStream}
            connection={connection}
          />
          <PinVideo />
        </>
      )}
      <div className="text-xl font-semibold py-4 text-gray-500">
        {roomCall?.roomInfo?.name}
      </div>
      <div className="px-4 flex flex-col gap-4">
        <ListTable tables={roomTables} />
        <ListFloor currentFloor={currentFloor} />
      </div>
      {roomCall?.showChat && (
        <ChatBox
          connection={connection}
          roomMessages={roomMessages}
          tableMessages={tableMessages}
          style={{ left: "98%", top: "100%" }}
        />
      )}
      <LobbyUser
        openLobby={roomCall?.showLobby}
        userJoined={userJoined}
        roomInfo={roomInfo}
      />
      <div className=" fixed z-30 top-full transform -translate-y-full w-max left-1/2 -translate-x-1/2">
        <Toolbar
          className="bg-white rounded-lg shadow-inner"
          connection={connection}
          mediaStatus={mediaStatus}
          userJoined={userJoined}
        />
      </div>
      <Present
        mediaStatus={mediaStatus}
        open={roomCall?.roomInfo?.isPresent}
        connection={connection}
        streamDatas={streamDatas}
        roomMessages={roomMessages}
        myStream={myStream}
        userJoined={userJoined}
        userRequests={userRequests}
      />
    </div>
  );
};

export default RoomDetail;
