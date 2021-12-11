import { Button } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import MicIcon from "@mui/icons-material/Mic";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { actSocketConnectRoom } from "./modules/action";
import axios from "axios";
import { useCookies } from "react-cookie";
import { actSetStream, actTurnOffAudio, actTurnOffVideo, actTurnOnAudio, actTurnOnVideo } from "../RoomDetail/modules/action";
const useStyles = makeStyles({
  root: {
    display: "flex",
    padding: "50px",
    justifyContent: 'center',
    gap: '2rem',
    alignItems: "center",
    minHeight: "100vh"
  },
  videoBox: {
    border: "1px solid black",
    backgroundImage: `url("https://st.quantrimang.com/photos/image/072015/22/avatar.jpg ")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "500px 250px",
  },
  pidsWrapper: {
    width: "100%",
  },
  pid: {
    width: "calc(10% - 10px)",
    height: "10px",
    display: "inline-block",
    margin: "5px",
    border: "solid 1px black",
  },
  mediaBox: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  btnBox: {
    border: "solid 1px gray",
    width: "400px",
    height: "300px",
    marginRight: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#DDDDDD",
    boxShadow: "15px",
  },
  btnMedia: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "30px",
  },
  titleRoom: {
    fontSize: "large",
    fontWeight: "bold",
    marginBottom: "15px",
    textTransform: "uppercase",
  },
});
const CheckMedia = (props) => {

  const classes = useStyles();
  const { setCheckMedia, roomId, peer } = props;
  //state
  const [cookies] = useCookies(['u_auth']);
  const [stateVideo, setStateVideo] = useState({ msg: 'Máy quay đang tắc', status: 'OFF' })
  const [infoRoom, setInfoRoom] = useState([]);
  //redux
  const dispatch = useDispatch();
  const socketRoomReducer = useSelector(state => state.socketRoomReducer);
  const mediaOption = useSelector(state => state.mediaReducer);
  const myStream = useSelector(state => state.streamReducer);
  //ref
  const videoRef = useRef(null);

  useEffect(() => {
    if (peer) connectHandler();
  }, [peer]);

  useEffect(() => {
    if (!myStream) return;
    videoRef.current.srcObject = myStream.stream;
    videoRef.current.muted = myStream.stream;
  }, [myStream])

  useEffect(() => {
    getRoomById(roomId);
  }, [roomId]);

  useEffect(() => {
    if (socketRoomReducer.isConnect) {
      const socketRoom = socketRoomReducer.socket;
      socketRoom.on("room:join-err", (data) => {
      });
    }
    return () => {
      if (socketRoomReducer.isConnect) {
        const socketRoom = socketRoomReducer.socket;
        socketRoom.off("room:join-err");
      }
    };
  }, [socketRoomReducer]);

  const connectHandler = () => {
    const tokenValue = "Beaner " + cookies.u_auth.accessToken;
    dispatch(
      actSocketConnectRoom(
        io("http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/socket/rooms", {
          forceNew: true,
          auth: {
            token: tokenValue,
          },
        })
      )
    );
  };

  const joinRoom = () => {
    if (!peer) return;
    socketRoomReducer.socket.emit("room:join", roomId, peer.id);
    setCheckMedia(true);
  };

  const startVideo = () => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
      setStateVideo({ msg: 'Đang khởi động máy quay', status: 'LOADING' })
      navigator.getUserMedia(
        { video: true, audio: false },
        function (stream) {
          if (myStream.stream)
            myStream.stream.addTrack(stream.getTracks()[0]);
          else
            dispatch(actSetStream(stream));

          dispatch(actTurnOnVideo());

          setStateVideo({ msg: '', status: 'RUNNING' })
        },
        function (err) {
          setStateVideo({ msg: 'Máy quay đang tắc', status: 'OFF' })
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
  };

  const startAudio = () => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true, video: mediaOption.video },
        function (stream) {
          //Audio
          if (myStream.stream)
            myStream.stream.addTrack(stream.getTracks()[0]);
          else
            dispatch(actSetStream(stream));

          dispatch(actTurnOnAudio());
        },
        function (err) {
          console.log("The following error occurred: " + err.name);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
  };

  // stop only camera
  const stopVideo = () => {
    const track = myStream.stream.getTracks().find(track => track.kind === 'video');
    track?.stop();
    myStream.stream.removeTrack(track);
    dispatch(actTurnOffVideo());
    setStateVideo({ msg: 'Máy quay đang tắc', status: 'OFF' })
  };

  // stop only mic
  const stopAudio = () => {
    const track = myStream.stream.getTracks().find(track => track.kind === 'audio');
    track?.stop();
    myStream.stream.removeTrack(track);
    dispatch(actTurnOffAudio());
  };

  const getRoomById = async (roomId) => {
    try {
      const fetch = {
        url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/room/${roomId}`,
        method: "get",
        headers: {
          Authorization: `token ${cookies.u_auth.accessToken}`,
        },
      };
      const res = await axios(fetch);
      setInfoRoom(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.mediaBox}>
        <div className='relative' style={{ width: '600px', height: '400px' }}>
          <video
            muted
            autoPlay
            className='bg-black rounded-xl w-full h-full'
            ref={videoRef}
          >
          </video>
          {stateVideo.status !== 'RUNNING' &&
            (<div className='absolute text-xl font-bold text-white top-1/2 left-1/2 transform -translate-x-1/2'>
              {stateVideo.msg}
            </div>)}
        </div>
      </div>
      <div className={classes.btnBox}>
        <div>
          <h5 className={classes.titleRoom}>{infoRoom?.name}</h5>
          <h5>{infoRoom?.description}</h5>
        </div>
        <div className={classes.btnMedia}>
          <div>
            {mediaOption?.video ? (
              <IconButton
                variant="contained"
                color="primary"
                onClick={stopVideo}
              >
                <PhotoCameraFrontIcon fontSize="large" />
              </IconButton>
            ) : (
              <IconButton
                variant="contained"
                style={{ color: "red" }}
                onClick={startVideo}
              >
                <VideocamOffIcon fontSize="large" />
              </IconButton>
            )}
          </div>
          <div className="ml-10">
            {mediaOption?.audio ? (
              <IconButton
                variant="contained"
                color="primary"
                onClick={stopAudio}
              >
                <MicIcon fontSize="large" />
              </IconButton>
            ) : (
              <IconButton
                variant="contained"
                style={{ color: "red" }}
                onClick={startAudio}
              >
                <MicOffIcon fontSize="large" />
              </IconButton>
            )}
          </div>
        </div>
        <div className={classes.btnJoin}>
          <Button
            onClick={() => {
              joinRoom();
            }}
            variant="contained"
            color="success"
          >
            Tham gia ngay
          </Button>
        </div>
      </div>
    </div >
  );
};

export default CheckMedia;
