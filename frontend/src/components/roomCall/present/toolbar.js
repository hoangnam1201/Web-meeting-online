import React, { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOff from "@mui/icons-material/VideocamOff";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import MicIcon from "@mui/icons-material/Mic";
import PausePresentationIcon from "@mui/icons-material/PausePresentation";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import { roomShowChatAction } from "./../../../store/actions/roomCallAction";
import { IconButton, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { confirmSwal } from "../../../services/swalServier";
import { useHistory } from "react-router-dom";
import Connection from "../../../services/connection";

const Toolbar = ({ connection, mediaStatus, ...rest }) => {
  const dispatch = useDispatch();
  const [autoHidden, setAutoHidden] = useState(false);
  const currentUser = useSelector((state) => state.userReducer);
  const roomCall = useSelector(state => state.roomCall);
  const history = useHistory();

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
    Connection.shareScreen('present');
  };

  return (
    <div className='absolute bg-white top-full z-50 b-0 left-1/2 group pt-2 transform -translate-y-full -translate-x-1/2 flex rounded-t-xl '>
      <div className={`flex items-center ${autoHidden && 'max-h-0 group-hover:max-h-96 duration-1000 transition-all overflow-hidden hover:overflow-visible'}`}>
        {roomCall?.roomInfo?.owner._id === currentUser?.user._id && (
          <div className="border-r-2 border-gray-400 text-base px-4">
            <button
              className="p-2 text-gray-800 focus:outline-none text-sm"
              onClick={() => {
                Connection.stopShareTrack()
                roomCall.socket.emit("present:stop");
              }}
            >
              <div>
                <PausePresentationIcon className="text-gray-600" />
              </div>
              Stop present
            </button>
          </div>
        )}
        <div className="flex gap-4 px-4">
          {mediaStatus.audio ? (
            <IconButton onClick={turnOffAudio}>
              <MicIcon fontSize="large" className="text-gray-600" />
            </IconButton>
          ) : (
            <IconButton onClick={turnOnAudio}>
              <MicOffIcon fontSize="large" className="text-gray-600" />
            </IconButton>
          )}
          {mediaStatus.video ? (
            <IconButton
              onClick={turnOffVideo}
            >
              <PhotoCameraFrontIcon fontSize="large" className="text-gray-600" />
            </IconButton>
          ) : (
            <IconButton onClick={turnOnVideo}>
              <VideocamOff fontSize="large" className="text-gray-600" />
            </IconButton>
          )}
          <IconButton onClick={() => shareScreen()}>
            <ScreenShareIcon
              fontSize="large"
              className={`${roomCall.sharing ? "text-blue-500" : "text-gray-600"
                }`}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              dispatch(roomShowChatAction(!roomCall?.showChat));
            }}
          >
            <ChatIcon fontSize="large" className="text-gray-600" />
          </IconButton>
        </div>
        <div className="border-l-2 border-gray-400 text-gray-600 px-3 flex gap-4 items-end">
          <button
            className="p-2 focus:outline-none text-sm"
            onClick={() =>
              confirmSwal("Are you sure?", "", () => {
                history.push("/user/my-event");
              })
            }
          >
            <div>
              <LogoutSharpIcon />
            </div>
            exit room
          </button>
          <div
            className="p-2 focus:outline-none text-sm "
          >
            <label onClick={() => setAutoHidden(!autoHidden)}>
              <Switch value={autoHidden} />
              <p className=" text-sm">
                auto hiden
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
