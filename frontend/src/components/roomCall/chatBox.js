import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { roomCallSendMessage, roomCallSendTableMessage, roomShowChatAction, } from "../../store/actions/roomCallAction";
import { Waypoint } from "react-waypoint";
import LinearProgress from "@mui/material/LinearProgress";
import { sendMessageAction } from "../../store/actions/messageAction";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { IconButton } from "@mui/material";
import Avatar from "react-avatar";
import moment from "moment";

const ChatBox = ({ roomMessages, tableMessages, ...rest }) => {
  const [value, setValue] = useState(0);
  const [msgText, setMsgText] = useState("");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userReducer);
  const roomCall = useSelector(state => state.roomCall)
  const endRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    endRef.current.scrollIntoView();
  }, [value]);

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    e.target.value = null;
  };

  const deleteFile = (index) => {
    files.splice(index, 1);
    setFiles([...files]);
  };

  const handleSendMessage = () => {
    if (!msgText && files.length === 0) return;
    if (value === 1) {
      dispatch(roomCallSendTableMessage({
        msgString: msgText,
        files: files.map((f) => ({ data: f, name: f.name })),
      }))
    }
    if (value === 0) {
      dispatch(roomCallSendMessage({
        msgString: msgText,
        files: files.map((f) => ({ data: f, name: f.name })),
      }))
    }
    setMsgText("");
    setFiles([]);
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
    <div
      className="fixed h-96 pb-1 w-80 transform -translate-y-full
      -translate-x-full z-40 top-5/6 bg-white shadow-md flex flex-col"
      {...rest}
    >
      <div className="shadow-md flex-grow-0 flex justify-between">
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
      <div className="flex-grow h-0 overflow-y-auto">
        <div hidden={value !== 1}>
          <div className="flex flex-col-reverse">
            {tableMessages?.map((m, index, messages) => (
              <Message
                key={index}
                msgData={m}
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
        <div hidden={value !== 0}>
          <div className="flex flex-col-reverse">
            {roomMessages?.map((m, index, messages) => {
              return (
                <Message
                  key={index}
                  msgData={m}
                  type={currentUser.user._id === m.sender._id ? 0 : 1}
                  position={getPosition(
                    m,
                    messages[index - 1],
                    messages[index + 1]
                  )}
                />
              );
            })}
            <Waypoint onEnter={() => console.log("enter")} />
          </div>
        </div>
        <div ref={endRef} />
      </div>

      {files.length > 0 && (
        <div className="h-8 flex-grow-0 flex-row flex gap-2 mx-2 overflow-x-auto scroll-none">
          {files.map((f, index) => (
            <div className="flex items-center rounded-lg bg-gray-300 px-2 justify-between">
              <p className="text-xs whitespace-nowrap break-normal">{f.name}</p>
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
      <div className={`${!roomCall?.chatLoading && 'invisible'}`}>
        <LinearProgress />
      </div>
      <div className="flex h-11 flex-grow-0 px-1">
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
  );
};

export const Message = React.memo(
  ({ nameClass, msgData, type, position, ...rest }) => {
    const timeAgo = moment(msgData.createdAt).fromNow();
    return (
      <div {...rest}>
        <div
          className={`flex flex-col ${type === 0 ? "items-end" : "items-start"
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
              className={`flex-grow w-0 flex flex-col items-start ${type === 0 && "items-end"
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
                <div
                  className={`px-4 py-1 whitespace-normal break-words text-sm font-thin  ${type === 0 ? "bg-blue-100" : "bg-gray-200"
                    } rounded-lg`}
                  style={{ maxWidth: "70%" }}
                >
                  {msgData.files.map((f, index) => (
                    <div className="flex items-center" key={index}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                      {f.fileId && (
                        <a
                          className=" whitespace-nowrap break-normal overflow-hidden"
                          href={`http://localhost:3002/api/file/download/${f.fileId}`}
                        >
                          {f.name}
                        </a>
                      )}
                      {f.data && (
                        <a
                          className=" whitespace-nowrap break-normal overflow-hidden"
                          href={window.URL.createObjectURL(
                            new Blob([f.data], { type: "*/*" })
                          )}
                          download={f.name}
                        >
                          {f.name}
                        </a>
                      )}
                    </div>
                  ))}
                  <p>{msgData.message}</p>
                </div>
              )}
              {position === "TOP" && (
                <div
                  className={`px-4 py-1 whitespace-normal break-words text-sm font-thin  ${type === 0 ? "bg-blue-100" : "bg-gray-200"
                    } ${type === 0
                      ? "rounded-l-lg rounded-tr-xl"
                      : "rounded-r-lg rounded-tl-xl"
                    }`}
                  style={{ maxWidth: "70%" }}
                >
                  {msgData.files.map((f, index) => (
                    <div className="flex items-center" key={index}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                      {f.fileId && (
                        <a
                          className=" whitespace-nowrap break-normal overflow-hidden"
                          href={`http://localhost:3002/api/file/download/${f.fileId}`}
                        >
                          {f.name}
                        </a>
                      )}
                      {f.data && (
                        <a
                          className=" whitespace-nowrap break-normal overflow-hidden"
                          href={window.URL.createObjectURL(
                            new Blob([f.data], { type: "*/*" })
                          )}
                          download={f.name}
                        >
                          {f.name}
                        </a>
                      )}
                    </div>
                  ))}
                  <p>{msgData.message}</p>
                </div>
              )}
              {position === "BOTTOM" && (
                <div
                  className={`px-4 py-1 whitespace-normal break-words text-sm font-thin ${type === 0 ? "bg-blue-100" : "bg-gray-200"
                    } ${type === 0
                      ? "rounded-l-lg rounded-br-xl"
                      : "rounded-r-lg rounded-bl-xl"
                    }`}
                  style={{ maxWidth: "70%" }}
                >
                  {msgData.files.map((f, index) => (
                    <div className="flex items-center" key={index}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-600 flex-grow-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                      {f.fileId && (
                        <a
                          className=" whitespace-nowrap break-normal overflow-hidden"
                          href={`http://localhost:3002/api/file/download/${f.fileId}`}
                        >
                          {f.name}
                        </a>
                      )}
                      {f.data && (
                        <a
                          className=" whitespace-nowrap break-normal overflow-hidden"
                          href={window.URL.createObjectURL(
                            new Blob([f.data], { type: "*/*" })
                          )}
                          download={f.name}
                        >
                          {f.name}
                        </a>
                      )}
                    </div>
                  ))}
                  <p>{msgData.message}</p>
                </div>
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
