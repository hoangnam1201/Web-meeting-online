import React, { useRef, useEffect } from "react";

const MyVideoCall = ({ peer, stream, user }) => {
  const videoRef = useRef(null);
  const HEIGHT = 300;
  const WIDTH = 300;
  useEffect(() => {
    console.count("video init");
    const c_user = localStorage.getItem("loginInfo");
    const currentUser = JSON.parse(c_user);

    if (user._id === currentUser._id) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = stream;
      return;
    }

    const call = peer.call(user.peerId, stream);
    call.on("stream", (parentStream) => {
      videoRef.current.srcObject = parentStream;
      videoRef.current.muted = parentStream;
    });
    call.on("close", () => {
      videoRef.current.srcObject = null;
    });
    return () => {
      call.off("close");
      call.off("stream");
    };
  }, []);
  return (
    <div>
      <div> username: {user.username}</div>
      <video
        height={HEIGHT}
        width={WIDTH}
        autoPlay
        ref={videoRef}
        className="rounded-xl"
      ></video>
    </div>
  );
};

export default MyVideoCall;
