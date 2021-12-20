import React, { useRef, useState } from "react";
import { IconButton, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MicOffIcon from "@mui/icons-material/MicOff";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import VideocamOff from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import sound from "../../sounds/meet-message-sound-1.mp3";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { useDispatch, useSelector } from "react-redux";
import { roomShowChatAction } from "../../store/actions/roomCallAction";
import { sendMessageAction } from "../../store/actions/messageAction";
import { confirmPresent, confirmSwal } from "../../services/swalServier";
import { useHistory } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import LobbyUser from "../Lobby";

const Toolbar = ({
  connection,
  mediaStatus,
  roomInfo,
  userJoined,
  ...rest
}) => {
  const roomCall = useSelector((state) => state.roomCall);
  const currentUser = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const stateMessage = useSelector(
    (state) => state.notifyMessageReducer.isReceive
  );
  const [openLobby, setOpenLobby] = useState(false);

  const notifySound = useRef(new Audio(sound));

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

  const soundMessage = () => {
    notifySound.current && notifySound.current.cloneNode(true).play();
  };

  const onPresent = () => {
    confirmPresent(() => {
      connection.current.socket.emit("room:present", 8);
    });
  };

  return (
    <div {...rest}>
      <LobbyUser openLobby={openLobby} userJoined={userJoined} />
      <div className="flex py-2 text-gray-500">
        {roomInfo?.owner._id === currentUser?.user._id && (
          <div className="border-r-2 border-gray-400 px-3">
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
            {stateMessage && !roomCall.showChat ? soundMessage() : undefined}
            {stateMessage && !roomCall.showChat ? (
              <Badge color="primary" variant="dot">
                <ChatIcon fontSize="large" />
              </Badge>
            ) : (
              <ChatIcon fontSize="large" />
            )}
          </IconButton>
          {openLobby ? (
            <IconButton onClick={() => setOpenLobby(false)}>
              <PeopleIcon className="text-blue-500" fontSize="large" />
            </IconButton>
          ) : (
            <IconButton onClick={() => setOpenLobby(true)}>
              <PeopleIcon fontSize="large" />
            </IconButton>
          )}
          <div className="border-l-2 border-gray-400 px-3 flex">
            <button
              className="p-2 text-gray-500 focus:outline-none text-sm font-semibold"
              onClick={() =>
                confirmSwal("Are you sure?", () => {
                  history.push("/user/my-event");
                })
              }
            >
              <div>
                <EventSeatIcon className="text-gray-500" />
              </div>
              exit table
            </button>
            <button
              className="p-2 text-gray-500 focus:outline-none text-sm font-semibold"
              onClick={() =>
                confirmSwal("Are you sure?", () => {
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
  );
};

export default Toolbar;
