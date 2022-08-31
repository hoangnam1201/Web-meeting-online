import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { roomShowChatAction } from "../../store/actions/roomCallAction";
import { Waypoint } from "react-waypoint";
import LinearProgress from "@mui/material/LinearProgress";
import { sendMessageAction } from "../../store/actions/messageAction";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { IconButton } from "@mui/material";
import Avatar from "react-avatar";
import moment from "moment";

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
      if (value === 1) {
        connection.current.socket.emit("table:send-message", msgText);
      }
      if (value === 0) {
        connection.current.socket.emit("room:send-message", msgText);
      }

      setMsgText("");
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = () => {
    if (value === 1) {
      connection.current.socket.emit("table:send-message", msgText);
    }
    if (value === 0) {
      connection.current.socket.emit("room:send-message", msgText);
    }
    setMsgText("");
    endRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const getPosition = (currentElem, nextElem, previousElem) => {
    if (
      currentElem?.sender._id === nextElem?.sender?._id &&
      currentElem?.sender._id === previousElem?.sender?._id
    )
      return "CENTER";
    if (currentElem?.sender?._id === nextElem?.sender?._id) return "TOP";
    if (currentElem?.sender?._id === previousElem?.sender?._id) return "BOTTOM";
    return "CENTER-END";
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
        <div hidden={value !== 1}>
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
        <div hidden={value !== 0}>
          <div className="flex flex-col-reverse">
            {roomMessages?.map((m, index, messages) => (
              <Message
                msgData={m}
                key={index}
                type={currentUser.user._id === m.sender._id ? 0 : 1}
                position={getPosition(
                  m,
                  messages[index - 1],
                  messages[index + 1]
                )}
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
      <div className="flex h-11">
        <input
          className="px-5 py-2 w-full focus:outline-none bg-gray-100 rounded-full"
          value={msgText}
          onChange={(e) => setMsgText(e.target.value)}
          onKeyDown={handleKeydown}
          placeholder="Type..."
        />
        <IconButton>
          <label>
            <input type="file" hidden multiple />
            <AttachFileIcon />
          </label>
        </IconButton>
        <IconButton onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export const Message = React.memo(
  ({ nameClass, msgData, type, position, ...rest }) => {
    const timeAgo = moment(msgData.createdAt).fromNow();
    return (
      <div {...rest}>
        <div
          className={`flex flex-col ${
            type === 0 ? "items-end" : "items-start"
          } px-2 overflow-hidden w-full`}
        >
          <div
            className={`flex p-1 ${type === 0 && "flex-row-reverse"} w-full`}
          >
            {type === 1 && (
              <div className="flex-grow-0 w-7 m-1 self-end">
                {(position === "BOTTOM" || position === "CENTER-END") && (
                  <div>
                    {msgData?.sender?.picture ? (
                      <img
                        src={msgData?.sender?.picture}
                        alt=""
                        className="cursor-pointer rounded-full w-7"
                      />
                    ) : (
                      <Avatar
                        name={msgData?.sender?.name}
                        size="28"
                        round={true}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
            <div
              className={`flex-grow w-0 flex flex-col items-start ${
                type === 0 && "items-end"
              }`}
            >
              {type === 1 && (position === "TOP" || position === "CENTER-END") && (
                <div
                  className={`mx-4 text-sm ${nameClass} text-left font-thin text-gray-500`}
                  style={{ fontSize: "14px" }}
                >
                  {msgData?.sender?.name}
                </div>
              )}
              {(position === "CENTER" || position === "CENTER-END") && (
                <p
                  className={`px-4 py-1 whitespace-normal break-words text-sm font-thin  ${
                    type === 0 ? "bg-blue-100" : "bg-gray-200"
                  } rounded-lg`}
                  style={{ maxWidth: "70%" }}
                >
                  {msgData.message}
                </p>
              )}
              {position === "TOP" && (
                <p
                  className={`px-4 py-1 whitespace-normal break-words text-sm font-thin  ${
                    type === 0 ? "bg-blue-100" : "bg-gray-200"
                  } ${
                    type === 0
                      ? "rounded-l-lg rounded-tr-xl"
                      : "rounded-r-lg rounded-tl-xl"
                  }`}
                  style={{ maxWidth: "70%" }}
                >
                  {msgData.message}
                </p>
              )}
              {position === "BOTTOM" && (
                <p
                  className={`px-4 py-1 whitespace-normal break-words text-sm font-thin ${
                    type === 0 ? "bg-blue-100" : "bg-gray-200"
                  } ${
                    type === 0
                      ? "rounded-l-lg rounded-br-xl"
                      : "rounded-r-lg rounded-bl-xl"
                  }`}
                  style={{ maxWidth: "70%" }}
                >
                  {msgData.message}
                </p>
              )}
            </div>
          </div>
          {(position === "BOTTOM" || position === "CENTER-END") && (
            <div className="text-gray-500 text-xs">{timeAgo}</div>
          )}
        </div>
      </div>
    );
  }
);

export default React.memo(ChatBox);
