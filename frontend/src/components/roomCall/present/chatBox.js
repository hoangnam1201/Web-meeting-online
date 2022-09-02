import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useDispatch } from "react-redux";
import { roomShowChatAction } from "../../../store/actions/roomCallAction";
import { Message } from "../chatBox";
import { Waypoint } from "react-waypoint";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BasicPopover from "../../Popover";

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

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      setMsgText("");
      connection.current.socket.emit("room:send-message", msgText);
    }
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
          </div>
          <div className="flex justify-center items-center bg-gray-600 py-4">
            <input
              className="mx-4 px-5 py-2 w-full shadow-md focus:outline-none bg-gray-100 rounded-xl"
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              onKeyDown={handleKeydown}
            />
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="flex-grow h-0 flex flex-col scroll-smooth overflow-y-scroll scroll-sm">
          {userJoined?.map((user, index) => {
            return (
              <div
                className="flex items-center justify-between px-5 py-3 text-white hover:bg-sky-200"
                key={index}
              >
                {user?.picture ? (
                  <img
                    src={user?.picture}
                    alt=""
                    className="w-10 rounded-full cursor-pointer"
                  />
                ) : (
                  <Avatar
                    name={user?.name}
                    size="40"
                    round={true}
                    className="cursor-pointer"
                  />
                )}

                <h5>{user?.name}</h5>
                <IconButton>
                  <MoreVertIcon className="text-white" />
                </IconButton>
              </div>
            );
          })}
        </div>
      )}
      {tab !== 1 && tab !== 0 && (
        <div className="h-0 flex-grow overflow-y-auto">
          {Object.values(userRequests).length > 0 && (
            <div className="flex flex-col">
              <div className="px-4 flex justify-start my-2">
                <button className="shadow-lg text-blue-700 px-4 py-1 text-sm rounded-md hover:bg-gray-100">
                  ACCEPT ALL
                </button>
              </div>
              <div className="flex-grow h-0">
                {Object.values(userRequests).map((request, index) => {
                  return (
                    <div
                      className="flex gap-4 items-center justify-between py-2 hover:bg-gray-100 px-2"
                      key={index}
                    >
                      <div className="flex items-center gap-4 w-0 flex-grow">
                        <Avatar
                          name={request.user?.name}
                          size="40"
                          round={true}
                          className="cursor-pointer"
                        />
                        <div className="w-0 flex-grow overflow-x-hidden">
                          <p className="whitespace-nowrap text-left font-semibold text-gray-500">
                            {request.user?.name.length < 15
                              ? request.user?.name
                              : `${request.user?.name.slice(0, 15)}...`}
                          </p>
                          <p className=" whitespace-nowrap text-left text-sm text-gray-400">
                            {" "}
                            {request.user?.email.length < 18
                              ? request.user?.email
                              : `${request.user?.email.slice(0, 15)}...`}
                          </p>
                        </div>
                      </div>
                      <div>
                        <BasicPopover>
                          <div className="flex flex-col text-gray-500">
                            <button
                              className="text-sm hover:bg-gray-100 px-4 py-2"
                              onClick={() =>
                                connection.current.replyRequest(request, true)
                              }
                            >
                              access
                            </button>
                            <button
                              className="text-sm hover:bg-gray-100 px-4 py-2"
                              onClick={() =>
                                connection.current.replyRequest(request, false)
                              }
                            >
                              refuse
                            </button>
                          </div>
                        </BasicPopover>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ChatBox;
