import React, { useEffect, useRef, useState } from "react";
import Connection from "../../services/connection";
import { IconButton, Button, CircularProgress, Alert } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import VideoIcon from "@mui/icons-material/PhotoCameraFront";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useParams } from "react-router";
import { getRoomAPI, updateStateRoomApi } from "../../api/room.api";
import { useSelector } from "react-redux";

const CheckMedia = ({ connection, myStream, canAccess, joinError }) => {
  const myVideo = useRef(null);
  const roomCall = useSelector(state => state.roomCall);
  const currentUser = useSelector(state => state.userReducer);
  const [media, setMedia] = useState({ audio: false, video: false });
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const openRoomHandler = () => {
    setLoading(true);
    updateStateRoomApi(id, 'OPENING').then(() => {
      getRoomInfo()
    })
  }

  useEffect(() => {
    getRoomInfo()
  }, []);

  const getRoomInfo = () => {
    getRoomAPI(id).then((res) => {
      setLoading(false);
      setRoomInfo(res.data);
    });
  }

  useEffect(() => {
    if (!myStream.stream) return;
    myVideo.current.srcObject = myStream.stream;
    myVideo.current.muted = myStream.stream;
    setMedia(Connection.getMediaStatus(myStream.stream));
  }, [myStream]);

  const joinRoomHandler = () => {
    roomCall.socket.emit("room:join", id);
  };

  return (
    <div className="min-h-screen flex justify-center items-center gap-8 w-full">
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
      <div className="w-96">
        <div className="py-4">
          <p className="text-2xl text-gray-500 font-semibold">
            {roomInfo?.name}
          </p>
          <p className="text-gray-400 font-bold">
            owner: {roomInfo?.owner?.name}
          </p>
        </div>
        {canAccess ? (
          <>
            <div className="flex justify-center gap-4 mb-4 ">
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
            {roomInfo && roomInfo?.state === 'OPENING' ? (
              joinError?.type === "REQUEST" ? (
                <div>
                  <CircularProgress />
                  <Alert
                    style={{ marginTop: "15px" }}
                    severity="info"
                    className="my-4"
                  >
                    {joinError.msg}
                  </Alert>
                </div>
              ) : joinError?.type === "REFUSE" ? (
                <div>
                  <Alert style={{ marginTop: "15px" }} severity="error">
                    {joinError.msg}
                  </Alert>
                </div>
              ) : !joinError && (
                <Button
                  onClick={joinRoomHandler}
                  variant="contained"
                  className="bg-blue-500"
                >
                  Join room
                </Button>
              )
            ) : (
              <div>
                <Alert severity="warning">
                  This room is <strong className="lowercase">{roomInfo?.state} </strong>- <strong>Can't join</strong>
                </Alert>
                {roomInfo?.owner._id === currentUser?.user._id && (
                  loading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      variant="contained"
                      className="bg-blue-500 mt-2"
                      color="secondary"
                      onClick={openRoomHandler}
                    >
                      Open room
                    </Button>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
};

export default CheckMedia;
