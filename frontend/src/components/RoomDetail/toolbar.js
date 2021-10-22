import React, { useRef, useState, useEffect } from "react";
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
import { useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
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
    height: "30px",
    alignItems: "center",
    fontSize: "20px",
    justifyContent: "center",
    background: "#000044",
    color: "white",
  },
  lobbyUser: {
    border: "none",
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    marginLeft: "10px",
    fontSize: "15px",
  },
  rootChat: {
    bottom: "80px",
    left: "450px",
    position: "absolute",
    background: "white",
    width: "400px",
    height: "500px",
    border: "2px solid #ddd",
    overflow: "hidden",
  },
  titleChat: {
    marginTop: "10px",
    fontWeight: "bold",
    justifyContent: "center",
    flex: "10%",
  },
  contentChat: {
    border: "1px solid #ddd",
    width: "400px",
    height: "410px",
    borderRadius: "4px",
    overflow: "hidden",
  },
  actionChat: {
    display: "flex",
  },
  messages: {
    height: "400px",
    padding: "15px 10px",
    overflowY: "auto",
  },
  msg: {
    border: "1px solid #ddd",
    padding: "7px 15px",
    borderRadius: "20px",
    fontSize: "13px",
    background: "#dfe6e9",
    marginBottom: "20px",
    width: "80%",
    float: "left",
  },
  msgSender: {
    border: "1px solid #ddd",
    padding: "7px 15px",
    borderRadius: "20px",
    fontSize: "13px",
    background: "#00cec9",
    marginBottom: "20px",
    width: "80%",
    float: "right",
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
const ToolBar = (props) => {
  const { member } = props;
  const classes = useStyles();
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("loginInfo"))
    : "";
  const [open, setOpen] = useState(false);
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [openLobby, setOpenLobby] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const screenRef = useRef();
  console.log(member);
  const socketRoomReducer = useSelector((state) => state.socketRoomReducer);
  const messageEl = useRef(null);
  useEffect(() => {
    if (messageEl) {
      messageEl?.current?.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scrollTo({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);
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
  useEffect(() => {
    if (socketRoomReducer.isConnect) {
      const socket = socketRoomReducer.socket;
      socket.on("room:message", (data) => {
        setMessages((perMessage) => {
          const newMessage = [...perMessage, ...data];
          return newMessage;
        });
      });
    }
    return () => {
      if (socketRoomReducer.isConnect) {
        const socketRoom = socketRoomReducer.socket;
        socketRoom.off("room:message");
      }
    };
  }, [socketRoomReducer]);
  const sendMessage = () => {
    if (socketRoomReducer.isConnect) {
      const socket = socketRoomReducer.socket;
      socket.emit("room:send-message", message);
    }
    setMessage("");
  };
  const handleEnterKey = (e) => {
    if (e.key === "Enter") sendMessage(e);
  };
  const popupChat = () => {
    return (
      <div className={classes.rootChat}>
        <div className={classes.titleChat}>
          <h5>Tin nhắn</h5>
        </div>
        <div className={classes.contentChat}>
          <div className={classes.messages} ref={messageEl}>
            {messages?.map((message, index) => (
              <div
                key={index}
                className={
                  message?.sender === loginInfo?._id
                    ? `${classes.msgSender}`
                    : `${classes.msg}`
                }
              >
                {message?.message}
              </div>
            ))}
          </div>
        </div>
        <div className={classes.actionChat}>
          <TextField
            onKeyDown={handleEnterKey}
            variant="outlined"
            margin="dense"
            value={message}
            fullWidth
            label="Nhập tin nhắn..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            onKeyDown={handleEnterKey}
            onClick={sendMessage}
            variant="contained"
            color="primary"
          >
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
