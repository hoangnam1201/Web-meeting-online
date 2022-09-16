import React from "react";
import Avatar from "react-avatar";
import SeatAvatar from "./seatAvatar";

const Seat1Left = ({ user, ...rest }) => {
  return (
    <div {...rest}>
      <div className="inline-block h-24">
        <div className="relative">
          <div className="bg-blue-300 w-16 h-16 rounded-full top-1/3 absolute -z-10" />
          <div className="h-8 overflow-hidden rounded-xl absolute z-20 top-1/3 left-3 transform -translate-y-1/2 -translate-x-1/2 -rotate-90">
            <div className="bg-red-200 w-20 h-20 rounded-full relative" />
            <div className="w-8 h-8 rounded-full absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-300" />
          </div>
          <div className="bg-red-400 w-16 h-16 rounded-full top-2 absolute"/>
          <div className="bg-red-300 w-16 h-16 rounded-full relative flex justify-center items-center">
            <SeatAvatar user={user} style={{zIndex:30}}/>
          </div>
          <div className="flex justify-around relative -z-10">
            <div className="bg-yellow-800 w-3 h-4 rounded-md" />
            <div className="bg-yellow-800 w-3 h-4 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seat1Left;
