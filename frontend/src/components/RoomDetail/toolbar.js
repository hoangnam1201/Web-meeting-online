import React, { useState } from "react";
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
});
const ToolBar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [openLobby, setOpenLobby] = useState(false);

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
  return (
    <>
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
        <IconButton>
          <ChatIcon fontSize="large" />
        </IconButton>
        <IconButton>
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
