import React from "react";
import Avatar from "react-avatar";

const Seat1 = ({ user, ...rest }) => {
  return (
    <div {...rest}>
      <div className="inline-block h-24">
        <div className="relative">
          {user &&
            (user?.picture ? (
              <img
                className="absolute z-50 top-0 left-0 rounded-full shadow-lg border-gray-500 border-2"
                src={user?.picture}
                alt=""
                width={50}
                height={50}
              />
            ) : (
              <Avatar
                name={user?.name}
                size="60"
                round={true}
                className="absolute z-50 top-0 left-0 shadow-md"
              />
            ))}
          <div className="h-8 overflow-hidden rounded-xl absolute z-40 -top-1 left-1/2 transform -translate-x-1/2">
            <div className="bg-red-200 w-20 h-20 rounded-full relative" />
            <div className="w-8 h-8 rounded-full absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-300" />
          </div>
          <div className="bg-red-300 w-16 h-16 rounded-full relative z-30" />
          <div className="bg-red-400 w-16 h-16 rounded-full top-2 absolute z-20" />
          <div className="flex justify-around relative z-10">
            <div className="bg-yellow-800 w-3 h-4 rounded-md" />
            <div className="bg-yellow-800 w-3 h-4 rounded-md" />
          </div>
          <div className="bg-blue-300 w-16 h-16 rounded-full top-1/3 absolute z-0" />
        </div>
      </div>
    </div>
  );
};

export default Seat1;
