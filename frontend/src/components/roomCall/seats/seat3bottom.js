import React from "react";
import Avatar from "react-avatar";

const Seat3Bottom = ({ users = [] }) => {
  return (
    <div>
      <div className="relative inline-block">
        <div className=" bg-red-200 w-96 h-4 absolute z-20 top-full" />
        <div className=" bg-red-200 w-4 h-12 absolute z-20 -left-3 rounded-lg top-12" />
        <div className=" bg-red-200 w-4 h-12 absolute z-20 left-96 rounded-lg top-12" />
        <div className="grid grid-cols-3 w-96 h-20 bg-red-300 relative z-10">
          <div className="flex justify-center">
            {users[0] &&
              (users[0]?.picture ? (
                <div className="group relative z-50">
                  <img
                    className="rounded-full shadow-lg border-gray-500 border-2"
                    src={users[0]?.picture}
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
                    name={users[0]?.name}
                    size="50"
                    round={true}
                    className="shadow-md"
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
          </div>
          <div className="border-red-400 border-l-4 flex justify-center">
            {users[1] &&
              (users[1]?.picture ? (
                <div className="group relative z-50">
                  <img
                    className="rounded-full shadow-lg border-gray-500 border-2"
                    src={users[1]?.picture}
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
                    name={users[1]?.name}
                    size="50"
                    round={true}
                    className="shadow-md"
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
          </div>
          <div className="border-red-400 border-l-4 flex justify-center">
            {users[2] &&
              (users[2]?.picture ? (
                <div className="group relative z-50">
                  <img
                    className="rounded-full shadow-lg border-gray-500 border-2"
                    src={users[2]?.picture}
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
                    name={users[2]?.name}
                    size="50"
                    round={true}
                    className="shadow-md"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seat3Bottom;
