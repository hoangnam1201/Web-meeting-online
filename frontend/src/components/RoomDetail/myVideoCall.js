import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MicOffIcon from "@mui/icons-material/MicOff";
import Avatar from "react-avatar";
import { IconButton, makeStyles } from "@material-ui/core";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

const useStyles = makeStyles({
  videoScale: {
    transform: "scaleX(5) scaleY(4) translateY(40px)",
  },
});

const MyVideoCall = ({ peer, user, ...rest }) => {
  const classes = useStyles();
  const [zoomIn, setZoomIn] = useState(false);
  const userReducer = useSelector((state) => state.userReducer);
  const myStream = useSelector((state) => state.streamReducer);
  const [call, setCall] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    console.count("video init");
  }, []);

  useEffect(() => {
    if (!userReducer || !myStream) return;
    const currentUser = userReducer.user;

    if (user.user._id === currentUser._id) {
      videoRef.current.srcObject = myStream.stream;
      videoRef.current.muted = myStream.stream;
      console.log(user.user.name, "dont call");
      return;
    }
    callVideo(user.peerId);
  }, [user]);

  const callVideo = (peerId) => {
    if (call) call.close();
    var options = {
      constraints: {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
        },
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      },
    };
    const _call = peer.call(peerId, myStream.stream, options);
    console.log(user.user.name, "call");
    setCall(_call);
    _call.on("stream", (parentStream) => {
      console.log("paren track", parentStream.getTracks());
      videoRef.current.srcObject = parentStream;
      videoRef.current.muted = parentStream;
    });
    _call.on("close", () => {
      console.log("close");
      videoRef.current.srcObject = null;
    });
  };

  return (
    <div {...rest} className={zoomIn ? classes.videoScale : ""}>
      <div className="relative overflow-hidden rounded-xl">
        {user?.video ? (
          <div className="absolute z-10 left-1/2 top-3 text-white transform -translate-x-1/2">
            {user?.user.name}
          </div>
        ) : (
          <div className="absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Avatar name={user?.user.name} size="200" round={false}></Avatar>
          </div>
        )}
        {!user?.audio && (
          <div className="absolute z-20">
            <MicOffIcon fontSize="medium" className="text-white" />
          </div>
        )}
        {zoomIn ? (
          <div className="absolute z-20 right-1">
            <IconButton
              onClick={() => {
                setZoomIn(false);
              }}
            >
              <ZoomOutMapIcon fontSize="small" className="text-white" />
            </IconButton>
          </div>
        ) : (
          <div className="absolute z-20 right-1">
            <IconButton
              onClick={() => {
                setZoomIn(true);
              }}
            >
              <ZoomOutMapIcon fontSize="small" className="text-white" />
            </IconButton>
          </div>
        )}
        <video
          autoPlay
          ref={videoRef}
          className="rounded-xl w-48 h-36 bg-black"
        ></video>
      </div>
    </div>
  );
};

export default MyVideoCall;
