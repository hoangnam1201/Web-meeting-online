import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";
import { fontSize } from "@mui/system";

const useStyles = makeStyles({
  messages: {
    height: "400px",
    padding: "15px 10px",
    overflowY: "auto",
  },
  msgReceiver: {
    border: "1px solid #ddd",
    padding: "7px 15px",
    borderRadius: "20px",
    fontSize: "13px",
    background: "#dfe6e9",
    marginBottom: "20px",
    width: "80%",
    float: "left",
    wordBreak: "break-all",
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
    wordBreak: "break-all",
  },

  actionChat: {
    display: "flex",
    width: "100%",
  },
  tabpanel: {
    margin: "0",
    padding: "10px",
  },
});
const ContentChat = (props) => {
  const classes = useStyles();
  const { tableMessages, socketTable } = props;
  const [value, setValue] = useState("1");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messageEl = useRef(null);
  const loginInfo = useSelector((state) => state.userReducer.user);
  const socketRoomReducer = useSelector((state) => state.socketRoomReducer);

  useEffect(() => {
    if (messageEl) {
      messageEl?.current?.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scrollTo({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (socketRoomReducer.isConnect) {
      const socket = socketRoomReducer.socket;
      socket.emit("room:get-messages");
      socket.on("room:message", (data) => {
        setMessages((perMessage) => {
          const newMessage = [...perMessage, data];
          return newMessage;
        });
      });
      socket.on("room:messages", (data) => {
        setMessages((perMessage) => {
          const messageTemp = [...data].reverse();
          const newMessage = [...perMessage, ...messageTemp];
          return newMessage;
        });
      });
    }
    return () => {
      if (socketRoomReducer.isConnect) {
        const socketRoom = socketRoomReducer.socket;
        socketRoom.offAny();
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
  const sendTableMessage = () => {
    if (socketTable) {
      socketTable.emit("table:send-message", message);
    }
    setMessage("");
  };
  const handleEnterKey = (e) => {
    if (e.key === "Enter") sendMessage(e);
  };
  const handleEnterKey2 = (e) => {
    if (e.key === "Enter") sendTableMessage(e);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Phòng Chung" value="1" />
            <Tab label="Bàn" value="2" />
          </TabList>
        </Box>
        <TabPanel className={classes.tabpanel} value="1">
          <div className={classes.messages}>
            {messages?.map((message, index) => (
              <div
                ref={messageEl}
                key={index}
                className={
                  message.sender._id === loginInfo._id
                    ? `${classes.msgSender}`
                    : `${classes.msgReceiver}`
                }
              >
                {message?.message}
              </div>
            ))}
          </div>
          <div className={classes.actionChat}>
            <TextField
              onKeyDown={handleEnterKey}
              variant="outlined"
              margin="dense"
              autoFocus
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
        </TabPanel>

        <TabPanel className={classes.tabpanel} value="2">
          <div className={classes.messages}>
            {tableMessages?.map((message, index) => (
              <div
                ref={messageEl}
                key={index}
                className={
                  message.sender._id == loginInfo?._id
                    ? `${classes.msgSender}`
                    : `${classes.msgReceiver}`
                }
              >
                {message?.message}
              </div>
            ))}
          </div>
          <div className={classes.actionChat}>
            <TextField
              onKeyDown={handleEnterKey2}
              variant="outlined"
              margin="dense"
              autoFocus
              value={message}
              fullWidth
              label="Nhập tin nhắn..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <IconButton
              onKeyDown={handleEnterKey2}
              onClick={sendTableMessage}
              variant="contained"
              color="primary"
            >
              <SendIcon fontSize="large" />
            </IconButton>
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ContentChat;
