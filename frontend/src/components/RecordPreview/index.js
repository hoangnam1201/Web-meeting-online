import React from "react";
import { useCookies } from "react-cookie";

const RecordPreview = () => {
  const [cookies] = useCookies(["urlBlob"]);
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <video
        className="w-1/2 h-1/2"
        src={cookies.urlBlob}
        autoPlay
        controls
      ></video>
    </div>
  );
};

export default RecordPreview;
