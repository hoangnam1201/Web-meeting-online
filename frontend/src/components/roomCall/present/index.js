import React, { useEffect } from "react";
import ChatBox from "./chatBox";
import Toolbar from "./toolbar";
import { useSelector } from "react-redux";
import VideoContainer from "./videoContainer";

const Present = ({
  mediaStatus,
  open,
  connection,
  myStream,
  streamDatas,
  roomMessages,
  userJoined,
  userRequests,
  ...rest
}) => {
  const roomCall = useSelector((state) => state.roomCall);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed top-0 left-0 h-full w-full"
          style={{ zIndex: 60 }}
        >
          <div className="bg-gray-500 opacity-60 w-full h-full z-0"></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4
                flex flex-col justify-center"
            style={{ height: "100%", width: "100%" }}
          >
            <div
              className="w-full h-5/6 flex gap-4"
              style={{ minHeight: "500px" }}
            >
              <div
                className={`h-full bg-gray-700 rounded-lg ${roomCall?.showChat ? " w-9/12" : "w-full"
                  }`}
              >
                <VideoContainer
                  myStream={myStream}
                  connection={connection}
                  streamDatas={streamDatas}
                />
              </div>
              {roomCall?.showChat && (
                <div className="w-3/12 h-full bg-gray-700 rounded-lg overflow-hidden">
                  <ChatBox
                    roomMessages={roomMessages}
                    userJoined={userJoined}
                    userRequests={userRequests}
                  />
                </div>
              )}
            </div>
            <Toolbar
              connection={connection}
              mediaStatus={mediaStatus}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Present;
