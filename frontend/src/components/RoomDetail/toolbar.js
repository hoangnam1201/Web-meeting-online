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
import { Avatar } from "@material-ui/core";
import ContentChat from "../ContentChat";
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
  const { member, tableMessages, socketTable } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [openLobby, setOpenLobby] = useState(false);
  const [openChat, setOpenChat] = useState(false);

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
        {mic ? (
          <IconButton>
            <MicIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton>
            <MicOffIcon fontSize="large" />
          </IconButton>
        )}
        {camera ? (
          <IconButton>
            <PhotoCameraFrontIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton>
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
