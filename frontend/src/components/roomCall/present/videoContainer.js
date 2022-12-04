import React, { useEffect, useRef, useState } from "react";
import { MyVideo, Video } from "../videoTableContainer";
import { useDispatch, useSelector } from "react-redux";
import { useResizeDetector } from "react-resize-detector";
import { setSelectedVideoAction } from "../../../store/actions/selectedVideoAction";
import Connection from "../../../services/connection";
import { IconButton } from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const VideoContainer = ({ myStream, streamDatas }) => {
  const selectedVideo = useSelector((state) => state.selectedVideo);
  const shareScreen = useSelector(state => state.shareScreenReducer);
  const dispatch = useDispatch()
  const ref = useRef();
  const [fullScreen, setFullScreen] = useState(false);
  const [sizeCam, setSizeCam] = useState({ width: 0, height: 0 });

  useResizeDetector({
    onResize: () => {
      displayCam();
    },
    targetRef: ref,
  });

  useEffect(() => {
    displayCam();
  }, [Object.values(streamDatas).length, shareScreen, selectedVideo]);

  const displayCam = () => {
    const widthScreen = ref.current.clientWidth;
    const aspectRatio = 1.777; //16:9
    const countVideo = (shareScreen?.isSharing ? 2 : 1) + Object.keys(streamDatas).length;
    let cols = 1;
    switch (countVideo) {
      case 1:
        cols = 1;
        break;
      case 2:
        cols = 2;
        break;
      case 3:
        cols = 2;
        break;
      default:
        cols = 4
        break;
    }
    if (!selectedVideo) {
      const camWidth = (widthScreen - 8 * cols) / cols
      const camHeight = camWidth / aspectRatio;
      setSizeCam({ width: camWidth, height: camHeight });
      return
    }
    const camHeight = 120;
    const camWidth = camHeight * aspectRatio;
    setSizeCam({ width: camWidth, height: camHeight });
  };

  return (
    <div
      ref={ref}
      className='w-full h-full mr-4 flex flex-col'
    >
      <div className={`h-full relative scroll-none transition-all flex gap-2 ${selectedVideo ?
        `items-start overflow-x-auto overflow-y-hidden justify-center ${fullScreen ? 'max-h-0' : 'max-h-32'}`
        : 'flex-wrap justify-center content-start max-h-full overflow-y-auto'}`}>
        {selectedVideo && <div className="fixed z-20 left-2">
          {fullScreen ?
            <IconButton className="bg-gray-600 shadow opacity-40 hover:opacity-80" onClick={() => { setFullScreen(false) }}>
              <ExpandMoreIcon className="text-white" />
            </IconButton>
            : <IconButton className="bg-gray-600 shadow" onClick={() => { setFullScreen(true) }}>
              <ExpandLessIcon className="text-white" />
            </IconButton>
          }
        </div>}
        {shareScreen?.isSharing && (
          <MyVideo
            style={{ ...sizeCam }}
            className='h-32 w-40'
            myStream={{ stream: Connection.shareStream, media: { video: true, audio: false }, peerId: Connection.sharePeerId }}
          />
        )}
        <MyVideo
          style={{ ...sizeCam }}
          className='h-32 w-40'
          myStream={{ ...myStream, peerId: Connection.myID }}
        />
        {streamDatas &&
          Object.keys(streamDatas).map((key, index) => {
            return (
              <Video
                style={{ ...sizeCam }}
                className="bg-black rounded-md overflow-hidden"
                streamData={streamDatas[key]}
                key={index}
                isPin={selectedVideo === key}
                onPin={() => {
                  if (selectedVideo === key)
                    return dispatch(setSelectedVideoAction(null));
                  dispatch(setSelectedVideoAction(key));
                }}
              />)
          })}
      </div>
      <div className="h-0 flex-grow bg-black rounded-lg">
        {selectedVideo && (selectedVideo === Connection?.myID ? (
          <MyVideo
            myStream={{ ...myStream, peerId: Connection.myID }}
            className="h-full w-auto"
          />
        ) : (selectedVideo === Connection?.sharePeerId ? (
          <MyVideo
            myStream={{ stream: Connection.shareStream, media: { video: true, audio: false }, peerId: Connection.sharePeerId }}
            className="h-full w-auto"
          />
        ) : (
          <Video
            className="bg-black rounded-md overflow-hidden relativew w-full h-full"
            streamData={streamDatas[selectedVideo]}
            isPin={true}
            onPin={() => {
              return dispatch(setSelectedVideoAction(null));
            }}
          />
        )))}
      </div>
    </div >
  );
};

export default VideoContainer;
