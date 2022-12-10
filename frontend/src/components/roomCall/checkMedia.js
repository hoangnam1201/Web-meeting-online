import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Connection from "../../services/connection";
import { IconButton, Button, CircularProgress, Alert } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import VideoIcon from "@mui/icons-material/PhotoCameraFront";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useHistory, useParams } from "react-router";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getRoomAPI, updateStateRoomApi } from "../../api/room.api";
import { useSelector } from "react-redux";
import { toastError } from "../../services/toastService";
import hark from "hark";

const CheckMedia = ({ myStream, canAccess, joinError }) => {
  const myVideo = useRef(null);
  const roomCall = useSelector(state => state.roomCall);
  const currentUser = useSelector(state => state.userReducer);
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const speech = useRef();
  const [volume, setVolume] = useState(0);
  const history = useHistory();

  const turnOffAudio = () => {
    Connection.turnOffAudio();
  };

  const turnOnAudio = () => {
    Connection.turnOnAudio();
  };

  const turnOffVideo = () => {
    Connection.turnOffVideo();
  };

  const turnOnVideo = () => {
    Connection.turnOnVideo();
  };

  useEffect(() => {
    getRoomInfo()
  }, [id]);

  const openRoomHandler = () => {
    setLoading(true);
    updateStateRoomApi(id, 'OPENING').then(() => {
      getRoomInfo()
    }).catch((e) => {
      toastError(e.response.data.msg)
      setLoading(false)
    })
  }

  const getRoomInfo = () => {
    getRoomAPI(id).then((res) => {
      setLoading(false);
      setRoomInfo(res.data);
    });
  }

  useLayoutEffect(() => {
    if (!myStream.stream) return;
    myVideo.current.srcObject = myStream.stream;
    speech.current = hark(myStream.stream);
    speech.current.setInterval(100)
    speech.current.on('volume_change', (e) => {
      setVolume(Math.round((100 + e) / 30))
    })
    return () => {
      speech.current?.stop();
    }
  }, [myStream?.media]);

  const joinRoomHandler = () => {
    roomCall.socket.emit("room:join", id);
  };

  return (
    <div className="min-h-screen flex justify-center items-center flex-col lg:flex-row gap-8 w-full">
      <div className="fixed top-2 left-2">
        <IconButton onClick={() => {
          window.location.replace('/user/my-event');
        }}>
          <ArrowBackIosIcon />
        </IconButton>
      </div>
      <div>
        <div
          className="relative bg-black border-2 overflow-hidden rounded-md"
          style={{ width: "500px", height: "376px" }}
        >
          <video
            ref={myVideo}
            autoPlay
            muted
            style={{ width: "500px", height: "376px" }}
          />
          {!myStream?.media?.video && (
            <div
              className="absolute z-20 top-1/2 left-1/2 text-white transform -translate-x-1/2
                -translate-y-1/2 text-xl font-semibold"
            >
              The camera is off
            </div>
          )}
        </div>
      </div>
      <div className="w-64 md:w-96">
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
              {myStream?.media?.audio ? (
                <div className="flex flex-col items-center">
                  <div>
                    <IconButton
                      variant="contained"
                      color="primary"
                      onClick={turnOffAudio}
                    >
                      <MicIcon fontSize="large" />
                    </IconButton>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: volume + 1 }, (_, index) => index).map(i => (
                      <div className="h-1 w-2 rounded-full bg-blue-700" key={i + 'key'} />
                    ))}
                  </div>
                </div>
              ) : (
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={turnOnAudio}
                >
                  <MicOffIcon fontSize="large" className="text-red-500" />
                </IconButton>
              )}
              {myStream?.media?.video ? (
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
