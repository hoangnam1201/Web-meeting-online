import React from "react";
import Avatar from "react-avatar";
import SeatAvatar from "./seatAvatar";

const Seat3top = ({ users = [] }) => {
  return (
    <div className="relative flex flex-col items-center">
      <div className="flex">
        <div className=" bg-red-200 w-4 h-12 rounded-lg transform translate-x-1/2 z-10" />
        <div>
          <div className=" bg-red-200 w-96 h-4" />
          <div className="grid grid-cols-3 w-96 h-16 bg-red-300 relative">
            <div className="flex justify-center items-center">
              <SeatAvatar user={users[0]} />
            </div>
            <div className="border-red-400 border-l-4 flex justify-center items-center">
              <SeatAvatar user={users[1]} />
            </div>
            <div className="border-red-400 border-l-4 flex justify-center items-center">
              <SeatAvatar user={users[2]} />
            </div>
          </div>
        </div>
        <div className=" bg-red-200 w-4 h-12 rounded-lg transform -translate-x-1/2 z-10" />
      </div>
      <div className="grid w-96 h-2 bg-red-400" />
    </div>
  );
};

export default Seat3top;
