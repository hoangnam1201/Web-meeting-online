import React, { useEffect, useRef, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { roomShowChatAction } from "../../store/actions/roomCallAction";
import { Waypoint } from "react-waypoint";
import LinearProgress from "@mui/material/LinearProgress";
import { sendMessageAction } from "../../store/actions/messageAction";

const ChatBox = ({ connection, roomMessages, tableMessages, ...rest }) => {
  const [value, setValue] = useState(0);
  const [msgText, setMsgText] = useState("");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userReducer);
  const endRef = useRef(null);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    endRef.current.scrollIntoView();
  }, [value]);

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      if (value == 1) {
        connection.current.socket.emit("table:send-message", msgText);
      }
      if (value == 0) {
        connection.current.socket.emit("room:send-message", msgText);
      }

      setMsgText("");
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div {...rest}>
      <div className="shadow-md flex justify-between">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Room" />
          <Tab label="Table" />
        </Tabs>
        <Button
          onClick={() => {
            dispatch(roomShowChatAction(false));
            dispatch(sendMessageAction());
          }}
        >
          X
        </Button>
      </div>
      <div className="h-3/4 overflow-auto">
        <div hidden={value != 1}>
          <div className="flex flex-col-reverse">
            {tableMessages?.map((m, index) => (
              <Message
                msgData={m}
                key={index}
                type={currentUser.user._id === m.sender._id ? 0 : 1}
              />
            ))}
            <Waypoint onEnter={() => console.log("enter")} />
          </div>
        </div>
        <div hidden={value != 0}>
          <div className="flex flex-col-reverse">
            {roomMessages?.map((m, index) => (
              <Message
                msgData={m}
                key={index}
                type={currentUser.user._id === m.sender._id ? 0 : 1}
              />
            ))}
            <Waypoint onEnter={() => console.log("enter")} />
          </div>
        </div>
        <div ref={endRef} />
      </div>
      <div className="h-2">
        <div hidden={!tableMessages?.loading}>
          <LinearProgress />
        </div>
      </div>
      <input
        className="px-5 py-2 w-full shadow-md focus:outline-none bg-gray-100 rounded-full"
        value={msgText}
        onChange={(e) => setMsgText(e.target.value)}
        onKeyDown={handleKeydown}
      />
    </div>
  );
};

export const Message = ({ nameClass, msgData, type, ...rest }) => {
  return (
    <div {...rest}>
      <div
        className={`flex flex-col ${type === 0 ? "items-end" : "items-start"
          } mt-4 mx-2 `}
      >
        {type === 1 && (
          <div className={`text-sm mx-4 ${nameClass}`}>
            {msgData.sender?.name}
          </div>
        )}
        <div
          className={`w-3/4 h-auto ${type === 0 ? "bg-blue-200" : "bg-gray-200"
            } rounded-lg px-2 py-1
                 whitespace-normal break-words`}
        >
          {msgData.message}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatBox);
