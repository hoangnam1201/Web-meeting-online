import React, { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MicOffIcon from "@mui/icons-material/MicOff";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import VideocamOff from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { useDispatch, useSelector } from "react-redux";
import {
  roomCallJoinTable,
  roomShowChatAction,
  roomShowLobbyAction,
  setSeletedTable,
} from "../../store/actions/roomCallAction";
import { sendMessageAction } from "../../store/actions/messageAction";
import { confirmPresent, confirmSwal } from "../../services/swalServier";
import { Link, useHistory } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import { useReactMediaRecorder } from "react-media-recorder";
import { LinearProgress } from "@mui/material";

const Toolbar = ({ connection, mediaStatus, userJoined, ...rest }) => {
  const roomCall = useSelector((state) => state.roomCall);
  const currentUser = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ screen: true });

  const stateMessage = useSelector(
    (state) => state.notifyMessageReducer.isReceive
  );

  useEffect(() => {
    if (status === "stopped") {
      downloadRecord(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  const downloadRecord = (urlBlob) => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = urlBlob;
    a.download = "test.mp4";
    a.click();
    a.remove();
  };

  const turnOnRecord = () => {
    startRecording();
  };
  const turnOffAudio = () => {
    connection.current.turnOffAudio();
  };

  const turnOnAudio = () => {
    connection.current.turnOnAudio();
  };

  const turnOffVideo = () => {
    connection.current.turnOffVideo();
  };

  const turnOnVideo = () => {
    connection.current.turnOnVideo();
  };

  const shareScreen = async () => {
    connection.current.getDisplayMediaStream();
  };

  const onPresent = () => {
    confirmPresent(() => {
      roomCall.socket.emit("room:present", 8);
    });
  };

  const joinTableHandler = () => {
    if (roomCall && roomCall.selectedTable && !roomCall.joinLoading) {
      connection.current.clearTableMessages();
      connection.current.clearPeers();
      dispatch(roomCallJoinTable(roomCall.selectedTable, mediaStatus));
    }
  };
  const cancelSeleted = () => {
    if (!roomCall.joinLoading) dispatch(setSeletedTable(null));
  };

  return (
    <div {...rest}>
      {roomCall?.selectedTable && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full transform z-10 shadow-lg bg-white py-1 px-10 ">
          <div className="flex items-center gap-4">
            <p className=" whitespace-nowrap max-w-xs text-ellipsis overflow-hidden">
              you is selecting <b>{roomCall?.selectedTable}</b>
            </p>
            <div className="flex gap-2">
              <button
                className="p-1 px-4 bg-gray-500 hover:bg-gray-600 text-white shadow-md rounded"
                onClick={joinTableHandler}
                disabled={roomCall?.joinLoading}
              >
                join
              </button>
              <button
                className="p-1 shadow-md"
                onClick={cancelSeleted}
                disabled={roomCall?.joinLoading}
              >
                cancel
              </button>
            </div>
          </div>
          <div className={`${!roomCall?.joinLoading && "invisible"}`}>
            <LinearProgress />
          </div>
        </div>
      )}
      <div className="shadow mt-2 p-2 group">
        <div className="flex relative max-h-0 group-hover:max-h-96 duration-1000 transition-all overflow-hidden hover:overflow-visible">
          {roomCall?.roomInfo?.owner._id === currentUser?.user._id && (
            <div className="border-r-2 border-gray-400 px-3 flex items-center static">
              <div className="relative">
                <div className="peer text-gray-500 p-2">
                  <MoreVertIcon />
                </div>
                <div className="hidden flex-col absolute z-50 top-0 left-0 transform bg-white -translate-y-full -translate-x-1/2 shadow-md peer-hover:flex hover:flex rounded-md">
                  <button
                    className="p-2 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-200 whitespace-nowrap"
                    onClick={() => {
                      confirmSwal("Divide Into Tables", "", () => {
                        roomCall.socket.emit("room:divide-tables");
                      });
                    }}
                  >
                    divide into tables
                  </button>

                  {status !== "recording" ? (
                    <button
                      className="p-2 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-200 whitespace-nowrap"
                      onClick={turnOnRecord}
                    >
                      Record meeting
                    </button>
                  ) : (
                    <button
                      className="p-2 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-200 whitespace-nowrap"
                      onClick={stopRecording}
                    >
                      Stop recording
                    </button>
                  )}

                  <Link
                    to={`/user/management-groups/${roomCall?.roomInfo._id}`}
                    target="_blank"
                    className="p-2 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-200 whitespace-nowrap"
                  >
                    Groups management
                  </Link>
                  <Link
                    to={`/user/update-event/${roomCall?.roomInfo._id}`}
                    target="_blank"
                    className="p-2 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-200 whitespace-nowrap"
                  >
                    Room Setting
                  </Link>
                </div>
              </div>
              <button
                className="p-2 text-gray-500 focus:outline-none text-sm font-semibold"
                onClick={onPresent}
              >
                <div>
                  <PresentToAllIcon className="text-gray-500" />
                </div>
                present
              </button>
            </div>
          )}
          <div className="flex gap-4 px-4">
            {mediaStatus.audio ? (
              <IconButton onClick={turnOffAudio}>
                <MicIcon className="text-blue-500" fontSize="large" />
              </IconButton>
            ) : (
              <IconButton onClick={turnOnAudio}>
                <MicOffIcon className="text-red-600" fontSize="large" />
              </IconButton>
            )}
            {mediaStatus.video ? (
              <IconButton
                onClick={turnOffVideo}
                disabled={connection.current.isShare}
              >
                <PhotoCameraFrontIcon
                  className="text-blue-500"
                  fontSize="large"
                />
              </IconButton>
            ) : (
              <IconButton onClick={turnOnVideo}>
                <VideocamOff className="text-red-600" fontSize="large" />
              </IconButton>
            )}
            <IconButton onClick={shareScreen}>
              <ScreenShareIcon
                fontSize="large"
                className={`${connection.current.isShare && "text-blue-500"}`}
              />
            </IconButton>
            <IconButton
              onClick={() => {
                if (roomCall) dispatch(roomShowChatAction(!roomCall.showChat));
                dispatch(sendMessageAction());
              }}
            >
              {stateMessage && !roomCall.showChat ? (
                <Badge color="primary" variant="dot">
                  <ChatIcon fontSize="large" />
                </Badge>
              ) : (
                <ChatIcon fontSize="large" />
              )}
            </IconButton>
            {roomCall?.showLobby ? (
              <IconButton onClick={() => dispatch(roomShowLobbyAction(false))}>
                <PeopleIcon className="text-blue-500" fontSize="large" />
              </IconButton>
            ) : (
              <IconButton onClick={() => dispatch(roomShowLobbyAction(true))}>
                <PeopleIcon fontSize="large" />
              </IconButton>
            )}
            <div className="border-l-2 border-gray-400 px-3 flex">
              <button
                className="p-2 text-gray-500 focus:outline-none text-sm font-semibold"
                onClick={() => connection.current.leaveTable()}
              >
                <div>
                  <EventSeatIcon className="text-gray-500" />
                </div>
                exit table
              </button>
              <button
                className="p-2 text-gray-500 focus:outline-none text-sm font-semibold"
                onClick={() =>
                  confirmSwal("Are you sure?", "", () => {
                    history.push("/user/my-event");
                  })
                }
              >
                <div>
                  <LogoutSharpIcon className="text-gray-500" />
                </div>
                exit room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
