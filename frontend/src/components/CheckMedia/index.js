import { Button } from "@mui/material";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    display: "flex",
    padding: "100px",
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
});
const CheckMedia = () => {
  const classes = useStyles();
  const [playing, setPlaying] = useState(false);
  const WIDTH = 500;
  const HEIGHT = 500;
  const startVideo = () => {
    setPlaying(true);
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true, video: { width: 1280, height: 720 } },
        function (stream) {
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
  const stopVideo = () => {
    setPlaying(false);
    let video = document.querySelector("video");
    video.srcObject.getTracks()[0].stop();
  };
  return (
    <div className={classes.root}>
      <video
        height={HEIGHT}
        width={WIDTH}
        muted
        autoPlay
        className={`video ${classes.videoBox}`}
      ></video>
      <div>
        {playing ? (
          <Button variant="contained" color="primary" onClick={stopVideo}>
            Stop
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={startVideo}>
            Turn On Video
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckMedia;
