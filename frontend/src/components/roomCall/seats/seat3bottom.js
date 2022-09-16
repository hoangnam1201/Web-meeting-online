import React from "react";
import Avatar from "react-avatar";
import SeatAvatar from "./seatAvatar";

const Seat3Bottom = ({ users = [] }) => {
  return (
    <div className="relative">
      <div className="flex justify-center">
        <div className=" bg-red-200 w-4 h-12 rounded-lg self-end transform translate-x-1/2 z-10" />
        <div>
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
          <div className=" bg-red-200 w-96 h-4 top-full" />
        </div>
        <div className=" bg-red-200 w-4 h-12 rounded-lg self-end transform -translate-x-1/2 z-10" />
      </div>
    </div>
  );
};

export default Seat3Bottom;
