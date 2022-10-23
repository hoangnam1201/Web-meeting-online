import React from "react";
import ChatIcon from "@mui/icons-material/Chat";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOff from "@mui/icons-material/VideocamOff";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import MicIcon from "@mui/icons-material/Mic";
import PausePresentationIcon from "@mui/icons-material/PausePresentation";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import { roomShowChatAction } from "./../../../store/actions/roomCallAction";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { confirmSwal } from "../../../services/swalServier";
import { useHistory } from "react-router-dom";

const Toolbar = ({ connection, mediaStatus, ...rest }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userReducer);
  const roomCall = useSelector(state => state.roomCall);
  const history = useHistory();

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

  return (
    <div className="absolute top-full transform -translate-y-full flex justify-center w-full">
      <div className="flex bg-gray-700 rounded-t-xl ">
        {roomCall?.roomInfo?.owner._id === currentUser?.user._id && (
          <div className="border-r-2 border-gray-400 px-4">
            <button
              className="p-2 text-white focus:outline-none text-sm"
              onClick={() => {
                roomCall.socket.emit("present:stop");
              }}
            >
              <div>
                <PausePresentationIcon className="text-white" />
              </div>
              Stop present
            </button>
          </div>
        )}
        <div className="flex gap-4 px-4">
          {mediaStatus.audio ? (
            <IconButton onClick={turnOffAudio}>
              <MicIcon fontSize="large" className="text-white" />
            </IconButton>
          ) : (
            <IconButton onClick={turnOnAudio}>
              <MicOffIcon fontSize="large" className="text-white" />
            </IconButton>
          )}
          {mediaStatus.video ? (
            <IconButton
              onClick={turnOffVideo}
              disabled={connection.current.isShare}
            >
              <PhotoCameraFrontIcon fontSize="large" className="text-white" />
            </IconButton>
          ) : (
            <IconButton onClick={turnOnVideo}>
              <VideocamOff fontSize="large" className="text-white" />
            </IconButton>
          )}
          <IconButton onClick={() => shareScreen()}>
            <ScreenShareIcon
              fontSize="large"
              className={`${connection.current.isShare ? "text-blue-500" : "text-white"
                }`}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              dispatch(roomShowChatAction(true));
            }}
          >
            <ChatIcon fontSize="large" className="text-white" />
          </IconButton>
        </div>
        <div className="border-l-2 border-gray-400 px-3 flex gap-4">
          <button
            className="p-2 text-white focus:outline-none text-sm"
            onClick={() =>
              confirmSwal("Are you sure?", "", () => {
                history.push("/user/my-event");
              })
            }
          >
            <div>
              <LogoutSharpIcon className="text-white" />
            </div>
            exit room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
