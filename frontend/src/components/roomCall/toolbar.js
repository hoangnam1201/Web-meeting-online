import React, { useEffect, useRef, useState } from "react";
import { IconButton, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOff from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import { useDispatch, useSelector } from "react-redux";
import { roomShowChatAction } from "../../store/actions/roomCallAction";
import Connection from "../../services/connection";
import { sendMessageAction } from "../../store/actions/messageAction";
import sound from "../../sounds/meet-message-sound-1.mp3";

const Toolbar = ({ connection, mediaStatus, ...rest }) => {
  const roomCall = useSelector((state) => state.roomCall);
  const dispatch = useDispatch();
  const stateMessage = useSelector(
    (state) => state.notifyMessageReducer.isReceive
  );
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
  return (
    <div {...rest}>
      <div className="flex gap-8 py-2 text-gray-500">
        {mediaStatus.audio ? (
          <IconButton onClick={turnOffAudio}>
            <MicIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={turnOnAudio}>
            <MicOffIcon fontSize="large" />
          </IconButton>
        )}
        {mediaStatus.video ? (
          <IconButton
            onClick={turnOffVideo}
            disabled={connection.current.isShare}
          >
            <PhotoCameraFrontIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={turnOnVideo}>
            <VideocamOff fontSize="large" />
          </IconButton>
        )}
        <IconButton onClick={shareScreen}>
          <ScreenShareIcon
            fontSize="large"
            className={connection.current.isShare && "text-blue-500"}
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
      </div>
    </div>
  );
};

export default Toolbar;
