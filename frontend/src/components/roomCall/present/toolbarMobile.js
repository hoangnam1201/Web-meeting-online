import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import VideocamOff from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { useDispatch, useSelector } from "react-redux";
import {
  roomCallCloseRoomAction,
  roomShowChatAction,
  roomShowLobbyAction,
} from "../../../store/actions/roomCallAction";
import { sendMessageAction } from "../../../store/actions/messageAction";
import { confirmPresent, confirmSwal } from "../../../services/swalServier";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import Connection from "../../../services/connection";
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';
import PausePresentationIcon from "@mui/icons-material/PausePresentation";
import DoorBackIcon from '@mui/icons-material/DoorBack';

const MobileToolbar = ({ mediaStatus, userJoined, ...rest }) => {
  const roomCall = useSelector((state) => state.roomCall);
  const currentUser = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const stateMessage = useSelector(
    (state) => state.notifyMessageReducer.isReceive
  );

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
    Connection.shareScreen('table');
  };

  const onPresent = () => {
    confirmPresent(() => {
      roomCall.socket.emit("room:present", 8);
    });
  };

  const openNewTab = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div>
      <div className=" fixed bottom-0 left-0 bg-gray-100 rounded-full shadow-md transform -translate-y-1/2 translate-x-1/2 border border-gray-200">
        <IconButton onClick={() => setOpen(true)}>
          <AppSettingsAltIcon fontSize="large" />
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
      </div>

      <React.Fragment>
        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box>
            <List
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Toolbar items
                </ListSubheader>
              }
            >
              {
                mediaStatus.audio ? (
                  <ListItemButton onClick={turnOffAudio}>
                    <ListItemIcon>
                      <MicIcon />
                    </ListItemIcon>
                    <ListItemText primary='Microphone' />
                  </ListItemButton>
                ) : (
                  <ListItemButton onClick={turnOnAudio}>
                    <ListItemIcon>
                      <MicOffIcon />
                    </ListItemIcon>
                    <ListItemText primary='Microphone' />
                  </ListItemButton>
                )
              }
              {
                mediaStatus.video ? (
                  <ListItemButton onClick={turnOffVideo}>
                    <ListItemIcon>
                      <PhotoCameraFrontIcon />
                    </ListItemIcon>
                    <ListItemText primary='camera' />
                  </ListItemButton>
                ) : (
                  <ListItemButton onClick={turnOnVideo}>
                    <ListItemIcon>
                      <VideocamOff />
                    </ListItemIcon>
                    <ListItemText primary='camera' />
                  </ListItemButton>
                )
              }
              <ListItemButton
                onClick={() => { Connection.shareScreen('present') }}
              >
                <ListItemIcon>
                  <ScreenShareIcon />
                </ListItemIcon>
                <ListItemText primary='Share screen' />
              </ListItemButton>
              {roomCall?.roomInfo?.owner._id === currentUser?.user._id && (
                <React.Fragment>
                  <ListItemButton
                    onClick={() => {
                      Connection.stopShareTrack()
                      roomCall.socket.emit("present:stop");
                    }}
                  >
                    <ListItemIcon>
                      <PausePresentationIcon />
                    </ListItemIcon>
                    <ListItemText primary='Present' />
                  </ListItemButton>
                  <ListItemButton onClick={() => {
                    confirmSwal('Are you sure?', "close room", () => {
                      dispatch(roomCallCloseRoomAction(() => {
                        window.location.replace('/user/my-event');
                      }))
                    })
                  }}>
                    <ListItemIcon>
                      <DoorBackIcon />
                    </ListItemIcon>
                    <ListItemText primary='close room' />
                  </ListItemButton>
                </React.Fragment>
              )}
              <ListItemButton
                onClick={() =>
                  confirmSwal("Are you sure?", "", () => {
                    window.location.replace('/user/my-event');
                  })
                }
              >
                <ListItemIcon>
                  <LogoutSharpIcon />
                </ListItemIcon>
                <ListItemText primary='exit room' />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
    </div >
  );
};

export default MobileToolbar;
