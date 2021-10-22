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
import Peer from "peerjs";
import { actSocketConnectRoom } from "./modules/action";
const useStyles = makeStyles({
  root: {
    display: "flex",
    padding: "50px",
    justifyContent: "space-between",
    alignItems: "center",
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
});
const CheckMedia = (props) => {
  const classes = useStyles();
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [peerId, setPeerId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);
  const videoRef = useRef(null);
  const [audioVolume, setAudioVolume] = useState(0);
  const [streamMedia, setStreamMedia] = useState(null);
  const [streamMediaAudio, setStreamMediaAudio] = useState(null);
  const { setCheckMedia, roomId } = props;
  const WIDTH = 400;
  const HEIGHT = 400;
  const dispatch = useDispatch();
  const socketRoomReducer = useSelector((state) => state.socketRoomReducer);
  let peer;
  useEffect(() => {
    peer = new Peer(undefined, {
      host: "localhost",
      path: "/peerjs/meeting",
      port: 3002,
      debug: 3,
    });

    peer.on("open", (id) => {
      setPeerId(id);
    });

    connectHandler();
  }, []);

  useEffect(() => {
    if (socketRoomReducer.isConnect) {
      const socketRoom = socketRoomReducer.socket;
      socketRoom.on("room:join-err", (data) => {
        console.log(data);
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
    console.log("connect");
    const tokenValue = "Beaner " + accessToken.accessToken;
    dispatch(
      actSocketConnectRoom(
        io("http://localhost:3002/socket/rooms", {
          forceNew: true,
          auth: {
            token: tokenValue,
          },
        })
      )
    );
  };

  const joinRoom = () => {
    socketRoomReducer.socket.emit("room:join", roomId, peerId);
    setCheckMedia(true);
    console.log("join room");
  };

  const startVideo = () => {
    setPlaying(true);
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: false, video: true },
        function (stream) {
          //Video
          setStreamMedia(stream);
          var video = document.querySelector("video");
          video.srcObject = stream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        },
        function (err) {
          console.log("The following error occurred: " + err.name);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
  };
  const startAudio = () => {
    setPlayAudio(true);
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true, video: false },
        function (stream) {
          //Audio
          setStreamMediaAudio(stream);
          var audioContext = new AudioContext();
          var analyser = audioContext.createAnalyser();
          var microphone = audioContext.createMediaStreamSource(stream);
          var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
          analyser.smoothingTimeConstant = 0.8;
          analyser.fftSize = 1024;
          microphone.connect(analyser);
          analyser.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);
          javascriptNode.onaudioprocess = function () {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var values = 0;

            var length = array.length;
            for (var i = 0; i < length; i++) {
              values += array[i];
            }

            var average = values / length;

            // console.log(Math.round(average));
            colorPids(average);
          };
        },
        function (err) {
          console.log("The following error occurred: " + err.name);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
  };
  const colorPids = (vol) => {
    let amout_of_pids = Math.round(vol / 10);
    setAudioVolume(amout_of_pids);
  };

  // stop only camera
  const stopVideo = () => {
    setPlaying(false);
    var track = streamMedia.getTracks()[0];
    track.stop();
  };

  // stop only mic
  const stopAudio = () => {
    setPlayAudio(false);
    var track = streamMediaAudio.getTracks()[0];
    track.stop();
  };
  return (
    <div className={classes.root}>
      <div className={classes.mediaBox}>
        <h5>Camera</h5>
        <video
          height={HEIGHT}
          width={WIDTH}
          muted
          autoPlay
          className={`video ${classes.videoBox}`}
          ref={videoRef}
        ></video>

        <div className={`pidsWrapper mt-10 ${classes.pidsWrapper}`}>
          <h5>Microphone</h5>
          <div
            className={`pid ${classes.pid} ${audioVolume > 1 && "bg-black"}`}
          ></div>
          <div
            className={`pid ${classes.pid} ${audioVolume > 2 && "bg-black"}`}
          ></div>
          <div
            className={`pid ${classes.pid} ${audioVolume > 3 && "bg-black"}`}
          ></div>
          <div
            className={`pid ${classes.pid} ${audioVolume > 4 && "bg-black"}`}
          ></div>
          <div
            className={`pid ${classes.pid} ${audioVolume > 5 && "bg-black"}`}
          ></div>
          <div
            className={`pid ${classes.pid} ${audioVolume > 6 && "bg-black"}`}
          ></div>
          <div
            className={`pid ${classes.pid} ${audioVolume > 7 && "bg-black"}`}
          ></div>
          <div
            className={`pid ${classes.pid} ${audioVolume > 8 && "bg-black"}`}
          ></div>
          <div
            className={`pid ${classes.pid} ${audioVolume > 9 && "bg-black"}`}
          ></div>
          <div
            className={`pid ${classes.pid} ${audioVolume > 10 && "bg-black"}`}
          ></div>
        </div>
      </div>
      <div className={classes.btnBox}>
        <div className={classes.btnMedia}>
          <div>
            {playing ? (
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
            {playAudio ? (
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
    </div>
  );
};

export default CheckMedia;
