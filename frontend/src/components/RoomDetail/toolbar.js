import React, { useRef, useState } from "react";
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
import TextField from "@material-ui/core/TextField";
import SendIcon from "@mui/icons-material/Send";

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
  },
  lobbyBox: {
    width: "300px",
    display: "flex",
    justifyContent: "center",
  },
  rootChat: {
    bottom: "80px",
    left: "450px",
    position: "absolute",
    background: "white",
    width: "400px",
    height: "400px",
    border: "2px solid black",
  },
  titleChat: {
    marginTop: "10px",
    fontWeight: "bold",
    justifyContent: "center",
  },
  contentChat: {
    display: "flex",
    justifyContent: "center",
    width: "398px",
    height: "300px",
    border: "1px solid gray",
  },
  actionChat: {
    display: "flex",
  },
  textChat: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    marginRight: "300px",
    height: "30px",
    width: "100%",
    backgroundColor: "blue",
    color: "white",
    borderRadius: "10px",
  },
  screenShare: {
    position: "absolute",
    width: "700px",
    height: "400px",
    border: "1px solid black",
    background: "white",
    bottom: "100px",
    zIndex: "999",
  },
});
const ToolBar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [openLobby, setOpenLobby] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const screenRef = useRef();
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

  const popupChat = () => {
    return (
      <div className={classes.rootChat}>
        <div className={classes.titleChat}>
          <h5>Tin nhắn</h5>
        </div>
        <div className={classes.contentChat}>
          <h6 className={classes.textChat}>abczda</h6>
        </div>
        <div className={classes.actionChat}>
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            label="Nhập tin nhắn..."
          />
          <IconButton variant="contained" color="primary">
            <SendIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    );
  };
  const startShareScreen = () => {
    navigator.mediaDevices.getDisplayMedia(
      { video: { cursor: "always" }, audio: { restrictOwnAudio: false } },
      function (stream) {
        //Video
        // setStreamMedia(stream);
        const video = document.querySelector("video");
        video.srcObject = stream.getVideoTracks()[0];
        video.play();
        // video.onloadedmetadata = function (e) {
        //   video.play();
        // };
      },
      function (err) {
        console.log("The following error occurred: " + err.name);
      }
    );
  };
  return (
    <>
      {openChat ? popupChat() : null}
      {/* <video
        playsinline
        muted
        className={`video ${classes.screenShare}`}
        autoPlay
      ></video> */}
      <div className={classes.root}>
        <IconButton onClick={handleClickOpenDialog}>
          <RecordVoiceOverIcon fontSize="large" />
        </IconButton>
        {mic ? (
          <IconButton onClick={() => setMic(false)}>
            <MicIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={() => setMic(true)}>
            <MicOffIcon fontSize="large" />
          </IconButton>
        )}
        {camera ? (
          <IconButton onClick={() => setCamera(false)}>
            <PhotoCameraFrontIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={() => setCamera(true)}>
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
        <IconButton onClick={startShareScreen}>
          <ScreenShareIcon fontSize="large" />
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
        </Drawer>
      </div>
    </>
  );
};

export default ToolBar;
