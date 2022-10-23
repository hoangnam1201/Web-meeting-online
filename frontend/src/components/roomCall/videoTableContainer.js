import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import MicOffIcon from "@mui/icons-material/MicOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import Avatar from "react-avatar";
import { IconButton } from "@mui/material";
import { SET_SELECTEDVIDEO } from "../../store/reducers/selectVideoReducer";
import Connection from "../../services/connection";

const VideoTableContainer = ({
  connection,
  myStream,
  streamDatas,
  ...rest
}) => {
  return (
    <div {...rest}>
      <div className="flex gap-4 justify-center">
        <MyVideo
          className="w-44 h-32 bg-gray-600 rounded-md overflow-hidden"
          myStream={myStream}
          connection={connection}
        />
        {streamDatas &&
          Object.values(streamDatas).map((s, index) => {
            return (
              <Video
                className="w-44 h-32 bg-black rounded-md overflow-hidden"
                isPin={false}
                streamData={s}
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
  const [media, setMedia] = useState({ video: false, audio: false });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!myStream) return;
    const stream = myStream.stream;
    if (!stream) return;

    setMedia(Connection.getMediaStatus(stream));
    videoRef.current.muted = true;
    videoRef.current.srcObject = stream;
  }, [myStream]);

  return (
    <div {...rest}>
      <div className="h-full w-full relative rounded-md overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          className="h-full w-full"
          muted
          hidden={!media.video}
          style={{ maxHeight: "100%" }}
        />
        <div className="absolute top-1 left-1 z-10 w-full px-2 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="text-shadow text-white"> You </div>
            <div hidden={media.audio}>
              <MicOffIcon className="text-red-500" />
            </div>
          </div>
          <div>
            <IconButton
              onClick={() => {
                dispatch({
                  type: SET_SELECTEDVIDEO,
                  payload: {
                    user: { you: "you" },
                    stream: myStream.stream,
                    media,
                    peerId: connection.current.myID,
                  },
                });
              }}
            >
              <PushPinIcon className=" text-white" fontSize="small" />
            </IconButton>
          </div>
        </div>
        {!media.video && (
          <Avatar
            value="You"
            color="purple"
            round
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>
    </div>
  );
});

export const Video = ({ streamData, isPin, ...rest }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const { stream, user, media } = streamData;

  useEffect(() => {
    if (!stream) return;
    videoRef.current.muted = true;
    videoRef.current.srcObject = stream;
    audioRef.current.srcObject = stream;
  }, [stream]);

  const onPin = () => {
    if (!isPin)
      return dispatch({
        type: SET_SELECTEDVIDEO,
        payload: streamData,
      });
    return dispatch({
      type: SET_SELECTEDVIDEO,
      payload: null,
    });
  };

  return (
    <div {...rest}>
      <div className="h-full w-full relative rounded-md overflow-hidden bg-black">
        <video
          ref={videoRef}
          className={`h-full w-full ${!media.video && 'hidden'}`}
          autoPlay
          muted={true}
        />
        <audio ref={audioRef} autoPlay />
        <div className="w-full absolute top-1 left-1 z-10 flex justify-between px-3">
          <div className="flex gap-2">
            <div className="text-shadow text-white"> {user.name}</div>
            <div hidden={media.audio}>
              <MicOffIcon className="text-red-500" />
            </div>
          </div>
          <div>
            <IconButton onClick={onPin}>
              <PushPinIcon
                className={isPin ? "text-blue-500" : "text-white"}
                fontSize="small"
              />
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
      </div>
    </div>
  );
};

export default React.memo(VideoTableContainer);
