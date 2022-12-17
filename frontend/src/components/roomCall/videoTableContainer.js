import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import PushPinIcon from "@mui/icons-material/PushPin";
import Avatar from "react-avatar";
import { IconButton } from "@mui/material";
import { setSelectedVideoAction } from "../../store/actions/selectedVideoAction";
import Connection from "../../services/connection";
import hark from "hark";

const VideoTableContainer = ({
  myStream,
  streamDatas,
  ...rest
}) => {
  const shareScreen = useSelector(state => state.shareScreenReducer);
  const callAll = useSelector(state => state.callAllReducer);
  const [shareStreamData, setShareStreamData] = useState(null);

  useEffect(() => {
    if (shareScreen)
      setShareStreamData({
        stream: Connection.shareStream,
        media: { video: true, audio: false },
        peerId: Connection.sharePeerId
      })
    else
      setShareStreamData(null)
  }, [shareScreen?.isSharing])


  return (
    <div {...rest}>
      <div className="flex gap-4 justify-center">
        {shareScreen.isSharing && (
          <MyVideo
            className="w-44 h-32 bg-gray-600 rounded-md overflow-hidden"
            myStream={shareStreamData}
          />
        )}
        <MyVideo
          className="w-44 h-32 bg-gray-600 rounded-md overflow-hidden"
          myStream={myStream}
        />
        {callAll?.hostStream && (
          <Video
            className="w-44 h-32 bg-black rounded-md overflow-hidden"
            streamData={callAll?.hostStream}
          />
        )}
        {callAll?.hostShareStream && (
          <Video
            className="w-44 h-32 bg-black rounded-md overflow-hidden"
            streamData={callAll?.hostShareStream}
          />
        )}
        {streamDatas &&
          Object.keys(streamDatas).map((key, index) => {
            return (
              <Video
                className="w-44 h-32 bg-black rounded-md overflow-hidden"
                streamData={streamDatas[key]}
                key={index}
              />
            );
          })}
      </div>
    </div>
  );
};

export const MyVideo = React.memo(({ sharing = false, myStream, ...rest }) => {
  const videoRef = useRef(null);
  const selectedVideo = useSelector(state => state.selectedVideo);
  const dispatch = useDispatch();
  const speech = useRef();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!myStream) return;
    const stream = myStream.stream;
    if (!stream) return;
    videoRef.current.srcObject = stream;
    if (myStream.media.audio) {
      speech.current = hark(myStream.stream, { interval: 200 });
      speech.current.on('speaking', () => {
        setSpeaking(true)
      })
      speech.current.on('stopped_speaking', () => {
        setSpeaking(false)
      })
    }
    return () => {
      speech.current?.stop();
    }
  }, [myStream]);

  return (
    <div {...rest}>
      {myStream && (<div className="h-full w-full relative rounded-md overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="h-full w-full"
          hidden={!myStream?.media.video}
          style={{ maxHeight: "100%" }}
        />
        <div className="absolute top-1 left-1 z-10 w-full px-2 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="text-shadow text-white"> You </div>
            <div hidden={myStream.media.audio}>
              <MicOffIcon className="text-red-500" />
            </div>
            <div className="relative" hidden={!speaking || !myStream.media.audio}>
              <MicIcon className="text-white -z-10 absolute w-full h-full animate-ping" />
              <MicIcon className="text-blue-500" />
            </div>
          </div>
          <div>
            <IconButton
              onClick={() => {
                if (selectedVideo === myStream?.peerId) {
                  dispatch(setSelectedVideoAction(null));
                  return;
                }
                console.log(myStream.peerId)
                dispatch(setSelectedVideoAction(myStream.peerId));
              }}
            >
              <PushPinIcon className={`${selectedVideo === myStream?.peerId ? 'text-blue-500' : 'text-white'} `} fontSize="small" />
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

export const Video = ({ streamData = {}, muted = false, ...rest }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const speech = useRef();
  const [speaking, setSpeaking] = useState(false);
  const selectedVideo = useSelector((state) => state.selectedVideo);
  const { stream = null,
    user = null,
    media = { video: false, audio: false },
    peerId } = streamData;

  useEffect(() => {
    if (!stream) return;
    videoRef.current.srcObject = stream;
    if (!muted)
      audioRef.current.srcObject = stream;
    if (streamData.media.audio) {
      speech.current = hark(streamData.stream, { interval: 200 });
      speech.current.on('speaking', () => {
        setSpeaking(true)
        console.log(peerId)
        peerId && Connection.setUserSpeaking(peerId)
      })
      speech.current.on('stopped_speaking', () => {
        setSpeaking(false)
      })
    }
    return () => {
      speech.current?.stop();
      setSpeaking(false);
    }
  }, [stream, media.audio]);

  const onPin = () => {
    if (!selectedVideo)
      return dispatch(setSelectedVideoAction(peerId));
    return dispatch(setSelectedVideoAction(null));
  }

  return (
    <div {...rest}>
      {streamData && <div className="h-full w-full z-0 relative rounded-md overflow-hidden bg-black">
        <video
          ref={videoRef}
          className={`h-full w-full ${!media.video && "hidden"}`}
          muted
          autoPlay
        />
        {!muted && <audio ref={audioRef} autoPlay />}
        <div className="w-full absolute top-1 left-1 z-10 flex justify-between items-center px-3">
          <div className="flex gap-2 w-5/6">
            <div className="text-shadow text-white text-ellipsis overflow-hidden whitespace-nowrap ">
              {user?.name}
            </div>
            <div hidden={media.audio}>
              <MicOffIcon className="text-red-500" />
            </div>
            <div className="relative" hidden={!speaking || !media.audio}>
              <MicIcon className="text-white -z-10 absolute w-full h-full animate-ping" />
              <MicIcon className="text-blue-500" />
            </div>
          </div>
          {onPin && <div>
            <IconButton onClick={onPin}>
              <PushPinIcon className={`${peerId === selectedVideo ? 'text-blue-500' : 'text-white'} `} fontSize="small" />
            </IconButton>
          </div>}
        </div>
        {!media.video && (user?.picture ? (
          <img
            src={user?.picture}
            referrerPolicy="no-referrer"
            alt=""
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
        ) :
          <Avatar
            name={user?.name}
            round
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>}
    </div>
  );
};



export default React.memo(VideoTableContainer);
