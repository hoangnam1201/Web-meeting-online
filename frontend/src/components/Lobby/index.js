import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "react-avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import BasicPopover from "../Popover";
import { useSelector } from "react-redux";
import { Button, Paper } from "@mui/material";
import JoinerList from "./joinerList";
import RequestList from "./requestList";

const LobbyUser = (props) => {
  const { openLobby, userJoined, roomInfo, userRequests, connection } = props;
  const currentUser = useSelector((state) => state.userReducer);
  const roomCallState = useSelector((state) => state.roomCall);
  const [tab, setTab] = useState(0);

  const handleBuzzUser = (userId, text) => {
    connection.current.socket.emit("room:buzz", userId, text);
    console.log("click");
  };
  return (
    <>
      <div
        className={`fixed top-0 left-0 flex flex-col z-50 h-screen bg-white overflow-x-hidden shadow-md transition-all duration-300 ${
          openLobby ? "w-72" : "w-0"
        }`}
      >
        <div className="shadow mb-2">
          {roomInfo?.owner._id === currentUser?.user._id ? (
            <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)}>
              <Tab label="users" />
              <Tab label="request" />
            </Tabs>
          ) : (
            <p className="text-lg capitalize py-2 w-72 whitespace-nowrap">
              Users in room
            </p>
          )}
        </div>
        <div hidden={tab !== 0}>
          <JoinerList joiners={userJoined} />
        </div>
        <div hidden={tab !== 1} className="h-0 flex-grow overflow-y-auto">
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
      </div>
    </>
  );
};

export default React.memo(LobbyUser);
