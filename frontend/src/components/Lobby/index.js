import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "react-avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import BasicPopover from "../Popover";
import { useSelector } from "react-redux";
import { Button, Paper } from "@mui/material";

const LobbyUser = (props) => {
  const { openLobby, userJoined, roomInfo, userRequests, connection } = props;
  const currentUser = useSelector((state) => state.userReducer);
  const [tab, setTab] = useState(0);

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
          {userJoined?.map((user, index) => {
            return (
              <div
                className="flex gap-4 items-center justify-between py-2 hover:bg-gray-100 px-2"
                key={index}
              >
                {user?.picture ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.picture}
                      alt=""
                      className="cursor-pointer rounded-full w-12"
                    />
                    <p className=" whitespace-nowrap">
                      {user?.name.length < 15
                        ? user?.name
                        : `${user?.name.slice(0, 15)}...`}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={user?.name}
                      size="40"
                      round={true}
                      className="cursor-pointer"
                    />
                    <p className=" whitespace-nowrap">
                      {user?.name.length < 15
                        ? user?.name
                        : `${user?.name.slice(0, 15)}...`}
                    </p>
                  </div>
                )}
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </div>
            );
          })}
        </div>
        <div hidden={tab !== 1} className="h-0 flex-grow overflow-y-auto">
          {Object.values(userRequests).length > 0 && (
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
              <div className="flex-grow h-0">
                {Object.values(userRequests).map((request, index) => {
                  return (
                    <div
                      className="flex gap-4 items-center justify-between py-2 hover:bg-gray-100 px-2"
                      key={index}
                    >
                      <div className="flex items-center gap-4 w-0 flex-grow">
                        {request.user?.picture ? (
                          <img
                            src={request.user?.picture}
                            alt=""
                            className="rounded-full w-12 cursor-pointer"
                          />
                        ) : (
                          <Avatar
                            name={request.user?.name}
                            size="40"
                            round={true}
                            className="cursor-pointer"
                          />
                        )}
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
                          <div>
                            <Button
                              onClick={() =>
                                connection.current.replyRequest(request, true)
                              }
                            >
                              accept
                            </Button>
                          </div>
                          <div>
                            <Button
                              onClick={() =>
                                connection.current.replyRequest(request, false)
                              }
                            >
                              refuse
                            </Button>
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
      </div>
    </>
  );
};

export default React.memo(LobbyUser);
