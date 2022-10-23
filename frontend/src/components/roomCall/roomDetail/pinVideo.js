import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import  IconButton from "@mui/material/IconButton";
import MicOffIcon from "@mui/icons-material/MicOff";
import MinimizeIcon from "@mui/icons-material/Minimize";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { SET_SELECTEDVIDEO } from "../../../store/reducers/selectVideoReducer";
import Avatar from "react-avatar";

const PinVideo = () => {
  const selectedVideo = useSelector((state) => state.selectedVideo);
  const [size, setSize] = useState("50%");
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedVideo) return;
    const stream = selectedVideo.stream;
    if (!stream) return;
    document.body.style.overflow = "hidden";

    videoRef.current.muted = true;
    videoRef.current.srcObject = stream;

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedVideo]);

  return (
    <>
      {selectedVideo && (
        <div
          className="fixed rounded-md overflow-auto top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-lg bg-black"
          style={{ width: size, height: size, zIndex: "60" }}
        >
          <div className="flex justify-between px-3 absolute items-center w-full z-10 bg-black opacity-0 hover:opacity-60 transition-opacity">
            <div className="flex gap-2 ">
              <div className="text-shadow text-white">
                {" "}
                {selectedVideo.user?.name}{" "}
              </div>
              <div hidden={selectedVideo.media.audio}>
                <MicOffIcon className="text-red-500" />
              </div>
            </div>

            <div>
              <IconButton
                onClick={() => {
                  dispatch({
                    type: SET_SELECTEDVIDEO,
                    payload: null,
                  });
                }}
                variant="contained"
              >
                <MinimizeIcon fontSize="small" className="text-white" />
              </IconButton>
              {size === "50%" ? (
                <IconButton
                  onClick={() => {
                    setSize("80%");
                  }}
                  variant="contained"
                >
                  <OpenInFullIcon fontSize="small" className="text-white" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setSize("50%");
                  }}
                  variant="contained"
                >
                  <CloseFullscreenIcon
                    fontSize="small"
                    className="text-white"
                  />
                </IconButton>
              )}
            </div>
          </div>
          <video
            ref={videoRef}
            autoPlay
            className="h-full ml-auto mr-auto"
            muted
            hidden={!selectedVideo.media.video}
          />
          {!selectedVideo.media.video &&
            (selectedVideo.user.name ? (
              <Avatar
                name={selectedVideo.user.name}
                round
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            ) : (
              <Avatar
                value="you"
                color="purple"
                round
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            ))}
        </div>
      )}
    </>
  );
};

export default PinVideo