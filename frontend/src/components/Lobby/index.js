import React, { useState } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useDispatch, useSelector } from "react-redux";
import JoinerList from "./joinerList";
import RequestList from "./requestList";
import { roomRemoveRequestAction } from "../../store/actions/roomCallAction";

const LobbyUser = (props) => {
  const { openLobby, userJoined } = props;
  const currentUser = useSelector((state) => state.userReducer);
  const roomCall = useSelector((state) => state.roomCall);
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);

  const replyHandlerAll = () => {
    Object.values(roomCall.requests).forEach((request) => {
      roomCall?.socket.emit(
        "room:access-request",
        request.socketId,
        request.user._id,
        true
      );
      dispatch(roomRemoveRequestAction(request.user._id));
    });
  };
  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 flex flex-col z-50 h-screen bg-white overflow-x-hidden shadow-md transition-all duration-300 ${
          openLobby ? "w-80" : "w-0"
        }`}
      >
        <div className="shadow mb-2">
          {roomCall?.roomInfo?.owner?._id === currentUser?.user?._id ? (
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
          {roomCall && Object.values(roomCall.requests).length > 0 && (
            <div className="flex flex-col">
              <div className="px-4 flex justify-start my-2">
                <button
                  className="shadow-lg text-blue-700 px-4 py-1 text-sm rounded-md hover:bg-gray-100"
                  onClick={replyHandlerAll}
                >
                  ACCEPT ALL
                </button>
              </div>
              <RequestList requests={Object.values(roomCall.requests)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(LobbyUser);
