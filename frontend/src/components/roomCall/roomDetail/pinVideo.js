import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import MicOffIcon from "@mui/icons-material/MicOff";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CropFreeIcon from '@mui/icons-material/CropFree';
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import Avatar from "react-avatar";
import { setSelectedVideoAction } from "../../../store/actions/selectedVideoAction";

const PinVideo = ({ streamData }) => {
  const [size, setSize] = useState("50%");
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!streamData) return;
    const stream = streamData.stream;
    if (!stream) return;
    document.body.style.overflow = "hidden";

    videoRef.current.muted = true;
    videoRef.current.srcObject = stream;

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [streamData]);

  return (
    <>
      {streamData && (
        <div
          className="fixed rounded-md overflow-auto top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-lg bg-black"
          style={{ width: size, height: size, zIndex: "60" }}
        >
          <div className="flex justify-between px-3 absolute items-center w-full z-10 bg-black opacity-10 hover:opacity-80 transition-opacity">
            <div className="flex gap-2 ">
              <div className="text-shadow text-white">
                {streamData?.user?.name}{" "}
              </div>
              <div hidden={streamData.media.audio}>
                <MicOffIcon className="text-red-500" />
              </div>
            </div>

            <div>
              <IconButton
                onClick={() => {
                  dispatch(setSelectedVideoAction(null));
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
              ) : size === "80%" ? (
                <IconButton
                  onClick={() => {
                    setSize("100%");
                  }}
                  variant="contained"
                >
                  <CropFreeIcon
                    fontSize="small"
                    className="text-white"
                  />
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
            className={`h-full ml-auto mr-auto ${!streamData.media.video && 'hidden'}`}
            muted
          />
          {!streamData.media.video &&
            (streamData.user?.name ? (
              <Avatar
                name={streamData.user.name}
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