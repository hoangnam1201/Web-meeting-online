import React, { useEffect, useRef, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import VideoTableContainer from "../videoTableContainer";
import ChatBox from "../chatBox";
import Connection from "../../../services/connection";
import Present from "../present";
import LobbyUser from "../../Lobby";
import Toolbar from "../toolbar";
import PinVideo from "./pinVideo";
import ListFloor from "./listFloor";
import ListTable from "./listTable";
import ListQuiz from "./listQuiz";
import { isMobile } from "react-device-detect";
import MobileToolbar from "../toolbarMobile";
import UserInfoDialog from "./userInfoDialog";
import { useCallback } from "react";

const RoomDetail = ({
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
  const selectedVideo = useSelector((state) => state.selectedVideo)
  const callAll = useSelector(state => state.callAllReducer);
  const [pinVideoData, setPinVideoData] = useState(null);
  const [mediaStatus, setMediaStatus] = useState({
    audio: false,
    video: false,
  });

  useEffect(() => {
    const media = Connection.getMediaStatus(myStream.stream);
    setMediaStatus(media);
    Connection.replaceStream();
    roomCall.socket.emit(
      "change-media",
      media,
      roomCall.roomInfo?.isPresent === true ? "present" : "table"
    );
  }, [myStream]);

  useEffect(() => {
    switch (selectedVideo) {
      case Connection?.myID:
        return setPinVideoData(myStream);
      case Connection?.sharePeerId:
        return setPinVideoData({ stream: Connection?.shareStream, media: { video: true, audio: false } });
      case callAll?.hostStream?.peerId:
        return setPinVideoData(callAll?.hostStream);
      case callAll?.hostShareStream?.peerId:
        return setPinVideoData(callAll?.hostShareStream);
      default:
        return setPinVideoData(streamDatas[selectedVideo]);
    }
  }, [selectedVideo])

  return (
    <div
      className="min-h-screen relative bg-blue-50 pb-20"
    >
      <UserInfoDialog />
      {!roomCall?.roomInfo?.isPresent && (
        <>
          <VideoTableContainer
            className="sticky z-10 justify-center w-full overflow-x-auto top-4 scroll-none"
            streamDatas={streamDatas}
            myStream={myStream}
          />
          <PinVideo streamData={pinVideoData} />
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
      <ListQuiz />
      <div>
        {
          isMobile ? (
            <MobileToolbar
              mediaStatus={mediaStatus}
              userJoined={userJoined}
            />
          ) : (
            <Toolbar
              className="bg-white rounded-lg shadow-inner fixed z-30 top-full transform -translate-y-full w-max left-1/2 -translate-x-1/2"
              mediaStatus={mediaStatus}
              userJoined={userJoined}
            />
          )
        }
      </div>
      <Present
        mediaStatus={mediaStatus}
        open={roomCall?.roomInfo?.isPresent}
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
