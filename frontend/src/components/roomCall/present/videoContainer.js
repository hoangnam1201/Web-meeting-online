import React, { useEffect, useRef, useState } from "react";
import { MyVideo, Video } from "../videoTableContainer";
import { useDispatch, useSelector } from "react-redux";
import { useResizeDetector } from "react-resize-detector";
import { setSelectedVideoAction } from "../../../store/actions/selectedVideoAction";

const VideoContainer = ({ connection, myStream, streamDatas }) => {
  const selectedVideo = useSelector((state) => state.selectedVideo);
  const roomCall = useSelector(state => state.roomCall);
  const dispatch = useDispatch()
  const ref = useRef();
  const [heightCam, setHeightCam] = useState(0);

  const getCols = () => {
    if (selectedVideo) return "";
    switch (Object.values(streamDatas).length) {
      case 0:
        return "";
      case 1:
        return "grid-cols-2 grid gap-2  ";
      case 2:
        return "grid-cols-3 grid gap-2 ";
      case 3:
        return "grid-cols-2 grid gap-2 ";
      default:
        return "grid-cols-4 grid gap-2 ";
    }
  };
  useResizeDetector({
    onResize: () => {
      displayCam();
    },
    targetRef: ref,
  });

  useEffect(() => {
    displayCam();
  }, [Object.values(streamDatas).length]);

  const displayCam = () => {
    const widthScreen = ref.current.clientWidth;
    const aspectRatio = 1.777; //16:9
    let cols = 1;
    switch (Object.values(streamDatas).length) {
      case 0:
        cols = 1;
        break;
      case 1:
        cols = 2;
        break;
      case 2:
        cols = 3;
        break;
      case 3:
        cols = 2;
        break;
      default:
        cols = 4;
        break;
    }
    if (cols === 1) {
      setHeightCam(ref.current.clientHeight - 16);
      return
    }
    const calHeight = (widthScreen - 8 * cols) / cols / aspectRatio;
    setHeightCam(calHeight);
  };

  return (
    <div
      ref={ref}
      className={`p-3 w-full h-full overflow-auto scroll-sm ${getCols()}`}
    >
      {!selectedVideo ? (
        <>
          <MyVideo
            style={{ height: heightCam }}
            myStream={myStream}
            className="h-full"
            connection={connection}
          />
          {streamDatas &&
            Object.keys(streamDatas).map((key, index) => {
              return (
                <Video
                  style={{ height: heightCam }}
                  className="bg-black rounded-md overflow-hidden"
                  streamData={streamDatas[key]}
                  key={index}
                  onPin={() => {
                    if (!selectedVideo)
                      return dispatch(setSelectedVideoAction(key));
                    return dispatch(setSelectedVideoAction(null));
                  }}
                />)
            })}
        </>
      ) : (selectedVideo === roomCall?.myId ? (
        <MyVideo
          myStream={myStream}
          className="h-full w-auto"
          connection={connection}
        />
      ) : (< Video
        className="bg-black rounded-md overflow-hidden h-full relative"
        streamData={streamDatas[selectedVideo]}
        onPin={() => {
          return dispatch(setSelectedVideoAction(null));
        }}
      />)
      )}
    </div>
  );
};

export default VideoContainer;
