import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToolBar from "./toolbar";
import Table1 from "./tables/table1";
import Table2 from "./tables/table2";
import Table3 from "./tables/table3";
import Table5 from "./tables/table5";
import Table6 from "./tables/table6";
import Table7 from "./tables/table7";
import Table8 from "./tables/table8";
import Table4 from "./tables/tables4";
import VideoTableContainer from "./videoTableContainer";
import ChatBox from "./chatBox";
import MicOffIcon from "@mui/icons-material/MicOff";
import MinimizeIcon from "@mui/icons-material/Minimize";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import Avatar from "react-avatar";
import { IconButton } from "@mui/material";
import Connection from "../../services/connection";
import { SET_SELECTEDVIDEO } from "../../store/reducers/selectVideoReducer";
import Present from "./present";
import LobbyUser from "../Lobby";

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
  const [mediaStatus, setMediaStatus] = useState({
    audio: false,
    video: false,
  });

  useEffect(() => {
    const media = Connection.getMediaStatus(myStream.stream);
    setMediaStatus(media);
    connection.current.replaceStream();
    connection.current.socket.emit(
      "change-media",
      media,
      roomInfo?.isPresent === true ? "present" : "table"
    );
  }, [myStream]);

  return (
    <div className="min-h-screen relative bg-gray-100 pb-20">
      {!roomInfo?.isPresent && (
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
      <div
        className="text-xl font-semibold py-4 bg-gray-100 text-gray-500
            "
      >
        {connection?.current?.info?.name}
      </div>
      <div className="px-4 flex flex-col gap-4">
        <ListTable
          tables={roomTables}
          connection={connection}
          mediaStatus={mediaStatus}
        />
        <ListFloor
          floors={roomInfo?.floors}
          currentFloor={currentFloor}
          connection={connection}
        />
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
        userRequests={userRequests}
        roomInfo={roomInfo}
        connection={connection}
      />
      <div className="fixed z-30 top-full transform -translate-y-full flex justify-center w-full">
        <ToolBar
          className="bg-white rounded-lg shadow-inner"
          roomInfo={roomInfo}
          connection={connection}
          mediaStatus={mediaStatus}
          userJoined={userJoined}
        />
      </div>
      <Present
        mediaStatus={mediaStatus}
        open={roomInfo?.isPresent}
        connection={connection}
        streamDatas={streamDatas}
        roomMessages={roomMessages}
        myStream={myStream}
        roomInfo={roomInfo}
        userJoined={userJoined}
        userRequests={userRequests}
      />
    </div>
  );
};

const PinVideo = () => {
  const selectedVideo = useSelector((state) => state.selectedVideo);
  const [size, setSize] = useState("50%");
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedVideo) return;
    const stream = selectedVideo.stream;
    if (!stream) return;
    document.body.style.overflow = "hidden";

    videoRef.current.muted = true;
    videoRef.current.srcObject = stream;

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedVideo]);

  return (
    <>
      {selectedVideo && (
        <div
          className="fixed rounded-md overflow-auto top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-lg bg-black"
          style={{ width: size, height: size, zIndex: "60" }}
        >
          <div className="flex justify-between px-3 absolute items-center w-full z-10 bg-black opacity-0 hover:opacity-60 transition-opacity">
            <div className="flex gap-2 ">
              <div className="text-shadow text-white">
                {" "}
                {selectedVideo.user?.name}{" "}
              </div>
              <div hidden={selectedVideo.media.audio}>
                <MicOffIcon className="text-red-500" />
              </div>
            </div>

            <div>
              <IconButton
                onClick={() => {
                  dispatch({
                    type: SET_SELECTEDVIDEO,
                    payload: null,
                  });
                }}
                variant="contained"
              >
                <MinimizeIcon fontSize="small" className="text-white" />
              </IconButton>
              {size === "50%" ? (
                <IconButton
                  onClick={() => {
                    setSize("80%");
                  }}
                  variant="contained"
                >
                  <OpenInFullIcon fontSize="small" className="text-white" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setSize("50%");
                  }}
                  variant="contained"
                >
                  <CloseFullscreenIcon
                    fontSize="small"
                    className="text-white"
                  />
                </IconButton>
              )}
            </div>
          </div>
          <video
            ref={videoRef}
            autoPlay
            className="h-full ml-auto mr-auto"
            muted
            hidden={!selectedVideo.media.video}
          />
          {!selectedVideo.media.video &&
            (selectedVideo.user.name ? (
              <Avatar
                name={selectedVideo.user.name}
                round
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            ) : (
              <Avatar
                value="you"
                color="purple"
                round
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            ))}
        </div>
      )}
    </>
  );
};

const ListFloor = React.memo(({ floors, currentFloor, connection }) => {
  return (
    <>
      <div className="scroll-sm flex flex-row gap-4 border overflow-x-auto snap-x p-2">
        {floors?.map((f, index) => (
          <button
            onClick={() => {
              connection.current.socket.emit("floor:join", f);
            }}
            key={f}
            className={`shadow-md p-1 whitespace-nowrap rounded text-sm font-thin text-gray-500 snap-start scroll-ml-4 ${
              currentFloor === f && "shadow-lg bg-gray-200"
            }`}
          >
            Floor {index}
          </button>
        ))}
      </div>
    </>
  );
});

const ListTable = React.memo(({ tables, connection, mediaStatus }) => {
  const joinTable = (id) => {
    connection.current.clearPeers();

    connection.current.socket.emit(
      "table:join",
      id,
      connection.current.myID,
      mediaStatus
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 relative z-0 grid-flow-row-dense">
        {tables?.map((t) => {
          switch (t.numberOfSeat) {
            case 1:
              return (
                <Table1
                  key={t._id}
                  className="h-full shadow"
                  data={t}
                  onClick={() => joinTable(t._id)}
                />
              );
            case 2:
              return (
                <Table2
                  key={t._id}
                  className="h-full shadow"
                  data={t}
                  onClick={() => joinTable(t._id)}
                />
              );
            case 3:
              return (
                <Table3
                  key={t._id}
                  className="h-full shadow"
                  data={t}
                  onClick={() => joinTable(t._id)}
                />
              );
            case 4:
              return (
                <Table4
                  key={t._id}
                  className="h-full shadow"
                  data={t}
                  onClick={() => joinTable(t._id)}
                />
              );
            case 5:
              return (
                <Table5
                  key={t._id}
                  className="h-full col-span-2 shadow"
                  data={t}
                  onClick={() => joinTable(t._id)}
                />
              );
            case 6:
              return (
                <Table6
                  key={t._id}
                  className="h-full col-span-2 shadow"
                  data={t}
                  onClick={() => joinTable(t._id)}
                />
              );
            case 7:
              return (
                <Table7
                  key={t._id}
                  className="h-full col-span-2 shadow"
                  data={t}
                  onClick={() => joinTable(t._id)}
                />
              );
            default:
              return (
                <Table8
                  key={t._id}
                  className="h-full col-span-2 shadow"
                  data={t}
                  onClick={() => joinTable(t._id)}
                />
              );
          }
        })}
      </div>
    </>
  );
});

export default RoomDetail;
