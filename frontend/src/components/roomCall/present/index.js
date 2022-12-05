import React, { useEffect } from "react";
import ChatBox from "./chatBox";
import Toolbar from "./toolbar";
import { useSelector } from "react-redux";
import VideoContainer from "./videoContainer";
import { isMobile } from "react-device-detect";
import MobileToolbar from "./toolbarMobile";

const Present = ({
  mediaStatus,
  open,
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
          <div className="bg-gray-500 opacity-80 w-full h-full z-0"></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center"
            style={{ height: "100%", width: "100%" }}
          >
            <div
              className="w-full h-full flex"
              style={{ minHeight: "500px" }}
            >
              <div
                className="h-full flex-grow w-0 p-1"
              >
                <VideoContainer
                  myStream={myStream}
                  streamDatas={streamDatas}
                />
              </div>
              <div className={` ${roomCall.showChat ? 'max-w-full' : 'max-w-0'} w-80 h-full bg-white overflow-hidden transition-all duration-500`}>
                <ChatBox
                  roomMessages={roomMessages}
                  userJoined={userJoined}
                  userRequests={userRequests}
                />
              </div>
            </div>
            {isMobile ?
              <MobileToolbar
                mediaStatus={mediaStatus} />
              :
              <Toolbar
                mediaStatus={mediaStatus}
              />
            }
          </div>
        </div>
      )}
    </>
  );
};

export default Present;
