import IconButton from "@mui/material/IconButton";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  roomCallResponceRequests,
  roomCallSendMessage,
} from "../../../store/actions/roomCallAction";
import { Message } from "../chatBox";
import { Waypoint } from "react-waypoint";
import { useSelector } from "react-redux";
import { LinearProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const ChatBox = ({ roomMessages, userJoined }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userReducer);
  const [msgText, setMsgText] = useState("");
  const endRef = useRef(null);
  const [files, setFiles] = useState([]);
  const roomCall = useSelector((state) => state.roomCall);

  useEffect(() => {
    endRef?.current?.scrollIntoView();
  }, []);

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      setMsgText("");
      setFiles([]);
      dispatch(
        roomCallSendMessage({
          msgString: msgText,
          files: files.map((f) => ({ data: f, name: f.name })),
        })
      );
    }
    endRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleSendMessage = () => {
    dispatch(
      roomCallSendMessage({
        msgString: msgText,
        files: files.map((f) => ({ data: f, name: f.name })),
      })
    );

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
      <p className=" flex-grow-0 p-2 bg-slate-50 shadow text-slate-500 text-sm">
      CHAT BOX
      </p>
      <div className="flex-grow h-0 flex flex-col">
        <div className="flex-grow h-0 py-4">
          <div className="overflow-y-auto overflow-x-hidden scroll-sm h-full flex flex-col-reverse">
            <div className="flex flex-col-reverse">
              {roomMessages?.map((m, index, messages) => (
                <Message
                  msgData={m}
                  key={index}
                  width={320}
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
        <div className={`${!roomCall?.chatLoading && "invisible"}`}>
          <LinearProgress />
        </div>
        <div className="flex h-12 flex-grow-0 p-1 shadow-md border bg-slate-300 flex-nowrap overflow-hidden">
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
              <AttachFileIcon />
            </label>
          </IconButton>
          <IconButton onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
export default React.memo(ChatBox);
