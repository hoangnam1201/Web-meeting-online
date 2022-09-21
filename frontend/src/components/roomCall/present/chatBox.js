import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useEffect, useRef, useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useDispatch } from "react-redux";
import { roomShowChatAction } from "../../../store/actions/roomCallAction";
import { Message } from "../chatBox";
import { Waypoint } from "react-waypoint";
import { useSelector } from "react-redux";
import { LinearProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import JoinerList from "../../Lobby/joinerList";
import RequestList from "../../Lobby/requestList";

const ChatBox = ({
  connection,
  roomMessages,
  userJoined,
  userRequests,
  roomInfo,
}) => {
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userReducer);
  const [msgText, setMsgText] = useState("");
  const endRef = useRef(null);
  const [files, setFiles] = useState([]);
  const roomCallState = useSelector((state) => state.roomCall);

  console.log("roomcallstate", roomCallState);

  useEffect(() => {
    endRef?.current?.scrollIntoView();
  }, []);

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      setMsgText("");
      connection.current.socket.emit("room:send-message", {
        msgString: msgText,
        files: files.map((f) => ({ data: f, name: f.name })),
      });
    }
    setFiles([]);
    endRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleSendMessage = () => {
    connection.current.socket.emit("room:send-message", {
      msgString: msgText,
      files: files.map((f) => ({ data: f, name: f.name })),
    });

    setMsgText("");
    setFiles([]);
    endRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    e.target.value = null;
  };

  const deleteFile = (index) => {
    files.splice(index, 1);
    setFiles([...files]);
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
    <div className="overflow-auto h-full flex flex-col">
      <div className="flex justify-between" style={{ flexBasis: 0 }}>
        <Tabs value={tab} onChange={(e, tabValue) => setTab(tabValue)}>
          <Tab
            label="Chat"
            style={{ color: "white", padding: "10px" }}
            className="text-white"
          />
          <Tab
            label="Participants"
            style={{ color: "white", padding: "10px" }}
            className="text-white"
          />
          {roomInfo?.owner._id === currentUser?.user._id ? (
            <Tab
              label="Requests"
              style={{ color: "white", padding: "10px" }}
              className="text-white"
            />
          ) : (
            ""
          )}
        </Tabs>
        <IconButton onClick={() => dispatch(roomShowChatAction(false))}>
          <ArrowRightAltIcon fontSize="large" style={{ color: "white" }} />
        </IconButton>
      </div>
      {tab === 0 && (
        <div className="flex-grow h-0 flex flex-col">
          <div className="flex-grow h-0 py-4">
            <div className="overflow-auto scroll-sm h-full flex flex-col-reverse">
              <div className="flex flex-col-reverse">
                {roomMessages?.map((m, index, messages) => (
                  <Message
                    msgData={m}
                    nameClass={"text-white"}
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
          <div className="h-2 flex-grow-0">
            <div hidden={!roomMessages?.loading}>
              <LinearProgress />
            </div>
          </div>
          {files.length > 0 && (
            <div className="h-8 flex-grow-0 flex-row flex gap-2 mx-2 overflow-x-auto scroll-none">
              {files.map((f, index) => (
                <div className="flex items-center rounded-lg bg-gray-300 px-2 justify-between">
                  <p className="text-xs whitespace-nowrap break-normal">
                    {f.name}
                  </p>
                  <button onClick={() => deleteFile(index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4 hover:text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex h-11 flex-grow-0 px-1 bg-slate-500">
            <input
              className="px-5 py-2 w-full focus:outline-none bg-gray-100 rounded-full"
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              onKeyDown={handleKeydown}
              placeholder="Type..."
            />
            <IconButton>
              <label>
                <input type="file" hidden multiple onChange={onFileChange} />
                <AttachFileIcon className="text-white" />
              </label>
            </IconButton>
            <IconButton onClick={handleSendMessage}>
              <SendIcon className="text-white" />
            </IconButton>
          </div>
          {/* <div className="flex justify-center items-center bg-gray-600 py-4">
            <input
              className="mx-4 px-5 py-2 w-full shadow-md focus:outline-none bg-gray-100 rounded-xl"
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              onKeyDown={handleKeydown}
            />
          </div> */}
        </div>
      )}
      {tab === 1 && (
        <div className="flex-grow h-0 flex flex-col scroll-smooth overflow-y-scroll scroll-sm">
          <JoinerList joiners={userJoined} />
        </div>
      )}
      {tab !== 1 && tab !== 0 && (
        <div className="h-0 flex-grow overflow-y-auto">
          {roomCallState && Object.values(roomCallState.requests).length > 0 && (
            <div className="flex flex-col">
              <div className="px-4 flex justify-start my-2">
                <button
                  className="shadow-lg text-blue-700 px-4 py-1 text-sm rounded-md hover:bg-gray-100"
                  onClick={() => {
                    Object.values(userRequests).forEach((request) => {
                      connection.current.replyRequest(request, true);
                    });
                  }}
                >
                  ACCEPT ALL
                </button>
              </div>
              <RequestList requests={Object.values(roomCallState.requests)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default React.memo(ChatBox);
