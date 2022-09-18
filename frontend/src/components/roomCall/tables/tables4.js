import React from "react";
import Seat1 from "../seats/seat1";
import Seat1Bottom from "../seats/seat1bottom";
import Seat1Left from "../seats/seat1left";
import Seat1Right from "../seats/seat1right";

const Table4 = ({ data, ...rest }) => {
  return (
    <div {...rest}>
      <div
        className="bg-blue-200 h-full relative hover:border-blue-300 border-4"
        style={{ minWidth: "100px" }}
      >
        <div className="absolute z-50 text-white text-shadow">{data?.name}</div>
        <Seat1 className="z-20 relative" user={data?.users[1]} />
        <div className="z-10 relative flex justify-around">
          <Seat1Left user={data?.users[0]} />
          <div className="inline-block relative h-28">
            <div className="bg-white rounded-full w-24 h-24 relative z-10" />
            <div className="bg-gray-200 top-4 rounded-full w-24 h-24 z-0 absolute" />
          </div>
          <Seat1Right user={data?.users[2]} />
        </div>
        <div className="border-4 border-gray-100 w-1/2 h-1/2 absolute z-0 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"></div>
        <Seat1Bottom user={data?.users[3]} />
      </div>
    </div>
  );
};

export default Table4;
