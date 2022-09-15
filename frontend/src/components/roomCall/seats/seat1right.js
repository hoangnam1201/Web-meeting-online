import React from "react";
import Avatar from "react-avatar";

const Seat1Right = ({ user, ...rest }) => {
  return (
    <div {...rest}>
      <div className="inline-block h-24">
        <div className="relative">
          {user &&
            (user?.picture ? (
              <div className="group relative z-50">
                <img
                  className="absolute z-50 top-0 left-0 rounded-full shadow-lg border-gray-500 border-2"
                  src={user?.picture}
                  alt=""
                  width={50}
                  height={50}
                />
                <div className="hidden flex-col absolute top-10 right-8 z-50 transform bg-white -translate-y-full -translate-x-1/2 shadow-md group-hover:flex rounded-md ">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-200 whitespace-nowrap"
                  >
                    Buzz !!!
                  </button>
                </div>
              </div>
            ) : (
              <div className="group relative z-50">
                <Avatar
                  name={user?.name}
                  size="50"
                  round={true}
                  className="absolute  top-0 left-0 shadow-md"
                />
                <div className="hidden flex-col absolute top-10 left-20 z-50 transform bg-white -translate-y-full -translate-x-1/2 shadow-md group-hover:flex rounded-md ">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-200 whitespace-nowrap"
                  >
                    Buzz !!!
                  </button>
                </div>
              </div>
            ))}
          <div className="h-8 overflow-hidden rounded-xl absolute z-40 top-1/3 left-14 transform -translate-y-1/2 -translate-x-1/2 rotate-90">
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

export default Seat1Right;
