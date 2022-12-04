import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CoPresentIcon from '@mui/icons-material/CoPresent';
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MicOffIcon from "@mui/icons-material/MicOff";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import VideocamOff from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import DoorBackIcon from "@mui/icons-material/DoorBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import QuizIcon from '@mui/icons-material/Quiz';
import { useDispatch, useSelector } from "react-redux";
import {
  roomCallCloseRoomAction,
  roomCallJoinTable,
  roomShowChatAction,
  roomShowLobbyAction,
  roomShowQuizsAction,
  setSeletedTable,
} from "../../store/actions/roomCallAction";
import { sendMessageAction } from "../../store/actions/messageAction";
import { confirmPresent, confirmSwal } from "../../services/swalServier";
import { Link, useHistory } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import { useReactMediaRecorder } from "react-media-recorder";
import { LinearProgress, Switch } from "@mui/material";
import Connection from "../../services/connection";
import { callAllAction, closeCallAllAction } from "../../store/actions/callAllAction";

const Toolbar = ({ mediaStatus, userJoined, ...rest }) => {
  const roomCall = useSelector((state) => state.roomCall);
  const currentUser = useSelector((state) => state.userReducer);
  const callAll = useSelector(state => state.callAllReducer);
  const dispatch = useDispatch();
  const [autoHidden, setAutoHidden] = useState(false);
  const { status, startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder({
    screen: true,
    audio: true,
    blobPropertyBag: { type: 'video/mp4' },
    onStop: (bloburl, blob) => {
      downloadRecord(bloburl, blob)
    },
  });

  useEffect(() => {
    return () => {
      stopRecording();
      clearBlobUrl();
    }
  }, [])

  const stateMessage = useSelector(
    (state) => state.notifyMessageReducer.isReceive
  );

  const downloadRecord = async (blobUrl, blob) => {
    const file = new File([blob], 'aaa.mp4', { type: 'video/mp4' });
    const urldata = window.URL.createObjectURL(file);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = urldata;
    a.download = roomCall?.roomInfo._id + ".mp4";
    a.click();
    a.remove();
  };

  const turnOnRecord = () => {
    startRecording();
  };
  const turnOffAudio = () => {
    Connection.turnOffAudio();
  };

  const turnOnAudio = () => {
    Connection.turnOnAudio();
  };

  const turnOffVideo = () => {
    Connection.turnOffVideo();
  };

  const turnOnVideo = () => {
    Connection.turnOnVideo();
  };

  const shareScreen = async () => {
    if (callAll?.isCallAll)
      Connection.shareScreen('room');
    else
      Connection.shareScreen('table');
  };

  const onPresent = () => {
    confirmPresent(() => {
      roomCall.socket.emit("room:present", 8);
    });
  };

  const onCallAll = () => {
    if (!callAll?.isCallAll)
      return dispatch(callAllAction());
    dispatch(closeCallAllAction());
  }

  const joinTableHandler = () => {
    if (roomCall && roomCall.selectedTable && !roomCall.joinLoading) {
      Connection.clearTableMessages();
      Connection.clearPeers();
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
        <div
          className={`flex relative ${autoHidden &&
            " max-h-0 group-hover:max-h-96 duration-1000 transition-all overflow-hidden hover:overflow-visible"
            }`}
        >
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
                className={`p-2 ${callAll?.isCallAll ? 'text-blue-500' : 'text-gray-500'} focus:outline-none text-sm font-semibold`}
                disabled={callAll?.loading}
                onClick={onCallAll}
              >
                <div>
                  <CoPresentIcon />
                </div>
                call all
              </button>
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
                className={`${roomCall.sharing && "text-blue-500"}`}
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
                  <ChatIcon fontSize="large" className={roomCall.showChat ? 'text-blue-500' : ''} />
                </Badge>
              ) : (
                <ChatIcon fontSize="large" className={roomCall.showChat ? 'text-blue-500' : ''} />
              )}
            </IconButton>
            <IconButton
              onClick={(e) => {
                dispatch(roomShowLobbyAction(true));
                e.stopPropagation();
              }}
            >
              <PeopleIcon fontSize="large" />
            </IconButton>
            <IconButton
              onClick={() => {
                dispatch(roomShowQuizsAction(true))
              }}>
              <QuizIcon fontSize="large" />
            </IconButton>
            <div className="border-l-2 border-gray-400 px-3 flex items-end">
              <button
                className="p-2 text-gray-500 focus:outline-none text-sm font-semibold"
                onClick={() => Connection.leaveTable()}
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
                    window.location.replace('/user/my-event');
                  })
                }
              >
                <div>
                  <LogoutSharpIcon className="text-gray-500" />
                </div>
                exit room
              </button>
              {roomCall?.roomInfo?.owner._id === currentUser?.user._id && (
                <button
                  className="p-2 text-gray-500 focus:outline-none text-sm font-semibold"
                  onClick={() => {
                    confirmSwal('Are you sure?', "close room", () => {
                      dispatch(roomCallCloseRoomAction(() => {
                        window.location.replace('/user/my-event');
                      }))
                    })
                  }}
                >
                  <div>
                    <DoorBackIcon />
                  </div>
                  close room
                </button>
              )}
              <div className="p-2 text-gray-500 focus:outline-none text-sm font-semibold">
                <label onClick={() => setAutoHidden(!autoHidden)}>
                  <Switch value={autoHidden} />
                  <p>auto hide</p>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Toolbar;
