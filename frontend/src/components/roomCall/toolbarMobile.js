import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";
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
import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Drawer, LinearProgress, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Switch } from "@mui/material";
import Connection from "../../services/connection";
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';

const MobileToolbar = ({ mediaStatus, userJoined, ...rest }) => {
  const roomCall = useSelector((state) => state.roomCall);
  const currentUser = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [autoHidden, setAutoHidden] = useState(false);

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

  const openNewTab = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div>
      {roomCall?.selectedTable && (
        <div className=" fixed left-1/2 bottom-0 -translate-x-1/2 -translate-y-1/2 transform z-10 shadow-lg bg-white py-1 px-10">
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
          onClick={() => {
            dispatch(roomShowQuizsAction(true))
          }}>
          <QuizIcon fontSize="large" />
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
              {roomCall?.roomInfo?.owner._id === currentUser?.user._id && (
                <React.Fragment>
                  <ListItemButton
                    onClick={onPresent}>
                    <ListItemIcon>
                      <PresentToAllIcon />
                    </ListItemIcon>
                    <ListItemText primary='Present' />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => {
                      openNewTab(
                        `/user/update-event/${roomCall?.roomInfo?._id}`
                      )
                    }}
                  >
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary='Room setting' />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => openNewTab(`/user/management-groups/${roomCall?.roomInfo?._id}`)}
                  >
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary='Group management' />
                  </ListItemButton>
                  <ListItemButton onClick={() => {
                    confirmSwal("Divide Into Tables", "", () => {
                      roomCall.socket.emit("room:divide-tables");
                    })
                  }
                  }>
                    <ListItemIcon>
                      <TableRestaurantIcon />
                    </ListItemIcon>
                    <ListItemText primary='divide into tables' />
                  </ListItemButton>
                  <ListItemButton onClick={() => {
                    confirmSwal('Are you sure?', "close room", () => {
                      dispatch(roomCallCloseRoomAction(() => {
                        window.location.replace('/user/my-event');
                      }))
                    })
                  }}>
                    <ListItemIcon>
                      <TableRestaurantIcon />
                    </ListItemIcon>
                    <ListItemText primary='close room' />
                  </ListItemButton>
                </React.Fragment>
              )}
              <ListItemButton
                onClick={() => Connection.leaveTable()}
              >
                <ListItemIcon>
                  <EventSeatIcon />
                </ListItemIcon>
                <ListItemText primary='exit table' />
              </ListItemButton>
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
