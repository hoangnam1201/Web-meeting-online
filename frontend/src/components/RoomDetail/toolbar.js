import React, { useState, useEffect, useRef } from "react";
import MicIcon from "@mui/icons-material/Mic";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import { IconButton } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import ChatIcon from "@mui/icons-material/Chat";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MicOffIcon from "@mui/icons-material/MicOff";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { Avatar } from "@material-ui/core";
import ContentChat from "../ContentChat";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "./modules/action";
const useStyles = makeStyles({
  root: {
    background: "white",
    height: "75px",
    width: "500px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid black",
    padding: "10px 10px",
    borderRadius: "10px",
  },
  lobbyBox: {
    width: "300px",
    display: "flex",
    height: "30px",
    alignItems: "center",
    fontSize: "20px",
    justifyContent: "center",
    background: "#000044",
    color: "white",
    zIndex: "999",
  },
  lobbyUser: {
    border: "none",
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    marginLeft: "10px",
    fontSize: "15px",
  },
  videoUser: {
    position: "absolute",
    bottom: "400px",
    left: "100px",
    border: "1px solid black",
  },
  rootChat: {
    bottom: "80px",
    left: "450px",
    position: "absolute",
    background: "white",
    width: "400px",
    height: "550px",
    border: "2px solid #ddd",
    overflow: "hidden",
  },
  titleChat: {
    marginTop: "10px",
    fontWeight: "bold",
    textTransform: "uppercase",
    justifyContent: "center",
    flex: "10%",
  },
  contentChat: {
    border: "1px solid #ddd",
    width: "420px",
    height: "510px",
    borderRadius: "4px",
    overflow: "hidden",
  },
});
const ToolBar = (props) => {
  const classes = useStyles();
  const { member, tableMessages, socketTable } = props;
  //redux
  const mediaOption = useSelector((state) => state.mediaReducer);
  const myStream = useSelector((state) => state.streamReducer);
  const dispath = useDispatch();
  //state
  const [open, setOpen] = useState(false);
  const [openLobby, setOpenLobby] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    console.log(myStream?.stream.getTracks());
    socketTable.emit("table:change-media", { ...mediaOption });
  }, [mediaOption]);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenLobby(open);
  };

  const turnOnVideo = () => {
    navigator.getUserMedia({ video: true, audio: false }, (stream) => {
      myStream.stream.addTrack(stream.getTracks()[0]);
      dispath(actions.actTurnOnVideo());
    });
  };

  const turnOffVideo = () => {
    const track = myStream.stream
      .getTracks()
      .find((track) => track.kind === "video");
    track?.stop();
    myStream.stream.removeTrack(track);
    dispath(actions.actTurnOffVideo());
  };

  const turnOnAudio = () => {
    navigator.getUserMedia({ video: false, audio: true }, (stream) => {
      myStream.stream.addTrack(stream.getTracks()[0]);
      dispath(actions.actTurnOnAudio());
    });
  };

  const turnOffAudio = () => {
    const track = myStream.stream
      .getTracks()
      .find((track) => track.kind === "audio");
    track?.stop();
    myStream.stream.removeTrack(track);
    dispath(actions.actTurnOffAudio());
  };

  const shareScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        video: { cursor: "always" },
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      .then((stream) => {
        const screenTrack = stream.getVideoTracks()[0];

        const sender = myStream?.stream
          .getTracks()
          .find((track) => track.kind === "video");

        myStream.stream.removeTrack(sender);
        myStream.stream.addTrack(screenTrack);

        screenTrack.onended = () => {
          myStream.stream.removeTrack(screenTrack);
          turnOnVideo();
        };
      })
      .catch((err) => {
        console.log("Unable to get display media" + err);
      });
  };

  const popupChat = () => {
    return (
      <div className={classes.rootChat}>
        <div className={classes.titleChat}>
          <h5>Tin nhắn</h5>
        </div>
        <div className={classes.contentChat}>
          <ContentChat
            tableMessages={tableMessages}
            socketTable={socketTable}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {openChat ? popupChat() : null}

      <div className={classes.root}>
        <IconButton onClick={handleClickOpenDialog}>
          <RecordVoiceOverIcon fontSize="large" />
        </IconButton>
        {mediaOption.audio ? (
          <IconButton onClick={turnOffAudio}>
            <MicIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={turnOnAudio}>
            <MicOffIcon fontSize="large" />
          </IconButton>
        )}
        {mediaOption.video ? (
          <IconButton onClick={turnOffVideo}>
            <PhotoCameraFrontIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={turnOnVideo}>
            <VideocamOffIcon fontSize="large" />
          </IconButton>
        )}
        {openChat ? (
          <IconButton
            variant="contained"
            color="primary"
            onClick={() => setOpenChat(false)}
          >
            <ChatIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={() => setOpenChat(true)}>
            <ChatIcon fontSize="large" />
          </IconButton>
        )}
        <IconButton>
          <ScreenShareIcon onClick={shareScreen} fontSize="large" />
        </IconButton>
        <IconButton onClick={toggleDrawer(true)}>
          <GroupIcon fontSize="large" />
        </IconButton>
        <IconButton>
          <MoreVertIcon fontSize="large" />
        </IconButton>
      </div>
      <div className={classes.chatBox}>
        <Dialog disableEscapeKeyDown="true" open={open} onClose={handleClose}>
          <DialogTitle>Bạn muốn thuyết trình</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Đồng ý</Button>
            <Button onClick={handleClose}>Từ chối</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Drawer anchor="right" open={openLobby} onClose={toggleDrawer(false)}>
          <div className={classes.lobbyBox}>
            <h5>Lobby</h5>
          </div>
          <div>
            {member ? (
              member.map((member, index) => (
                <div className={classes.lobbyUser} key={index}>
                  <Avatar>{member.username.charAt(0)}</Avatar>
                  <div className="ml-5">{member.username}</div>
                </div>
              ))
            ) : (
              <h4>Không có user</h4>
            )}
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default ToolBar;
