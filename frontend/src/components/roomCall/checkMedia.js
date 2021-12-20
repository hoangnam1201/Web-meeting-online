import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Connection from "../../services/connection";
import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import VideoIcon from "@mui/icons-material/PhotoCameraFront";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useParams } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@material-ui/lab/Alert";

const CheckMedia = ({ connection, myStream, canAccess, joinError }) => {
  const myVideo = useRef(null);
  const [media, setMedia] = useState({ audio: false, video: false });
  const { id } = useParams();

  const turnOffAudio = () => {
    connection.current.turnOffAudio();
  };

  const turnOnAudio = () => {
    connection.current.turnOnAudio();
  };

  const turnOffVideo = () => {
    connection.current.turnOffVideo();
  };

  const turnOnVideo = () => {
    connection.current.turnOnVideo();
  };

  useEffect(() => {
    if (!myStream.stream) return;
    myVideo.current.srcObject = myStream.stream;
    myVideo.current.muted = myStream.stream;
    setMedia(Connection.getMediaStatus(myStream.stream));
  }, [myStream]);

  const joinRoomHandler = () => {
    connection.current.socket.emit("room:join", id);
  };

  return (
    <div className="min-h-screen flex justify-center items-center gap-8">
      <div
        className="relative bg-black border-2 overflow-hidden rounded-md"
        style={{ width: "500px", height: "376px" }}
      >
        <video
          ref={myVideo}
          muted
          autoPlay
          style={{ width: "500px", height: "376px" }}
        />
        {!media.video && (
          <div
            className="absolute z-20 top-1/2 left-1/2 text-white transform -translate-x-1/2
                -translate-y-1/2 text-xl font-semibold"
          >
            The camera is off
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl text-gray-500 font-semibold my-4">{id}</div>
        {canAccess ? (
          <>
            <div className="flex justify-center gap-4 my-4 ">
              {media.audio ? (
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={turnOffAudio}
                >
                  <MicIcon fontSize="large" />
                </IconButton>
              ) : (
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={turnOnAudio}
                >
                  <MicOffIcon fontSize="large" className="text-red-500" />
                </IconButton>
              )}
              {media.video ? (
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={turnOffVideo}
                >
                  <VideoIcon fontSize="large" />
                </IconButton>
              ) : (
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={turnOnVideo}
                >
                  <VideocamOffIcon fontSize="large" className="text-red-500" />
                </IconButton>
              )}
            </div>
            {joinError ? (
              <Alert style={{ marginTop: "15px" }} severity="error">
                {joinError}
              </Alert>
            ) : null}
            <Button
              onClick={joinRoomHandler}
              variant="contained"
              className="bg-blue-500"
            >
              Tham gia ngay
            </Button>
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
};

export default CheckMedia;
