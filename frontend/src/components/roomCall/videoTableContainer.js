import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MicOffIcon from "@mui/icons-material/MicOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import Avatar from "react-avatar";
import { IconButton } from "@mui/material";
import { setSelectedVideoAction } from "../../store/actions/selectedVideoAction";

const VideoTableContainer = ({
  connection,
  myStream,
  streamDatas,
  ...rest
}) => {
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.selectedVideo)
  const onPin = (peerId) => {
    if (!selectedVideo)
      return dispatch(setSelectedVideoAction(peerId));
    return dispatch(setSelectedVideoAction(null));
  };

  return (
    <div {...rest}>
      <div className="flex gap-4 justify-center">
        <MyVideo
          className="w-44 h-32 bg-gray-600 rounded-md overflow-hidden"
          myStream={myStream}
          connection={connection}

        />
        {streamDatas &&
          Object.keys(streamDatas).map((key, index) => {
            return (
              <Video
                className="w-44 h-32 bg-black rounded-md overflow-hidden"
                streamData={streamDatas[key]}
                onPin={() => onPin(key)}
                key={index}
              />
            );
          })}
      </div>
    </div>
  );
};

export const MyVideo = React.memo(({ connection, myStream, ...rest }) => {
  const videoRef = useRef(null);
  const roomCall = useSelector((state) => state.roomCall);
  const selectedVideo = useSelector(state => state.selectedVideo);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!myStream) return;
    const stream = myStream.stream;
    if (!stream) return;

    videoRef.current.muted = true;
    videoRef.current.srcObject = stream;
  }, [myStream]);



  return (
    <div {...rest}>
      {myStream && (<div className="h-full w-full relative rounded-md overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          className="h-full w-full"
          muted
          hidden={!myStream?.media.video}
          style={{ maxHeight: "100%" }}
        />
        <div className="absolute top-1 left-1 z-10 w-full px-2 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="text-shadow text-white"> You </div>
            <div hidden={myStream.media.audio}>
              <MicOffIcon className="text-red-500" />
            </div>
          </div>
          <div>
            <IconButton
              onClick={() => {
                if (!selectedVideo) dispatch(setSelectedVideoAction(roomCall?.myId));
                else dispatch(setSelectedVideoAction(null));
              }}
            >
              <PushPinIcon className={`${selectedVideo === roomCall.myId ? 'text-blue-500' : 'text-white'} `} fontSize="small" />
            </IconButton>
          </div>
        </div>
        {!myStream.media.video && (
          <Avatar
            value="You"
            color="purple"
            round
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>)}
    </div>
  );
});

export const Video = ({ streamData, onPin, ...rest }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const { stream, user, media } = streamData;
  const selectedVideo = useSelector(state => state.selectedVideo);

  useEffect(() => {
    if (!stream) return;
    videoRef.current.muted = true;
    videoRef.current.srcObject = stream;
    audioRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div {...rest}>
      {streamData && <div className="h-full w-full relative rounded-md overflow-hidden bg-black">
        <video
          ref={videoRef}
          className={`h-full w-full ${!media.video && "hidden"}`}
          autoPlay
          muted={true}
        />
        <audio ref={audioRef} autoPlay />
        <div className="w-full absolute top-1 left-1 z-10 flex justify-between items-center px-3">
          <div className="flex gap-2 w-5/6">
            <div className="text-shadow text-white text-ellipsis overflow-hidden whitespace-nowrap ">
              {user.name}
            </div>
            <div hidden={media.audio}>
              <MicOffIcon className="text-red-500" />
            </div>
          </div>
          <div>
            <IconButton onClick={onPin}>
              <PushPinIcon className={`${selectedVideo === streamData.peerId ? 'text-blue-500' : 'text-white'} `} fontSize="small" />
            </IconButton>
          </div>
        </div>
        {!media.video && !user.you && user?.picture && (
          <img
            src={user?.picture}
            alt=""
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
        )}
        {!media.video && !user.you && !user?.picture && (
          <Avatar
            name={user.name}
            round
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )}
        {!media.video && user.you && (
          <Avatar
            value={"you"}
            round
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>}
    </div>
  );
};

export default React.memo(VideoTableContainer);
