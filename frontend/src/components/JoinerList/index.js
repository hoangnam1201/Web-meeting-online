import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "react-avatar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { kickComfirmSwal, SendBuzzSwal } from "../../services/swalServier";
import { JoinerTag } from "../JoinerTag";
import { IconButton } from "@mui/material";

const JoinerList = ({ joiners }) => {
  return (
    <div>
      {joiners?.map((user, index) => (
        <JoinerItem joiner={user} key={index} />
      ))}
    </div>
  );
};

const JoinerItem = ({ joiner }) => {
  const [open, setOpen] = useState(false);
  const roomCallState = useSelector((state) => state.roomCall);
  const userSate = useSelector((state) => state.userReducer);

  const KickHandler = (id) => {
    kickComfirmSwal((value) => {
      roomCallState?.socket.emit("room:kick", id, !!value);
    });
  };

  const BuzzHandler = (id) => {
    SendBuzzSwal((value) => {
      roomCallState?.socket.emit("room:buzz", id, value);
    });
  };
  return (
    <div className="flex gap-4 items-center justify-between py-2 hover:bg-gray-100 px-2">
      <div className="flex items-center gap-4">
        {joiner?.picture ? (
          <img
            src={joiner?.picture}
            referrerPolicy="no-referrer"
            alt=""
            className="cursor-pointer rounded-full w-12"
          />
        ) : (
          <Avatar
            name={joiner?.name}
            size="48"
            round={true}
            className="cursor-pointer"
          />
        )}
        <div className="flex-grow overflow-x-hidden">
          <div className="flex items-center">
            <p className="whitespace-nowrap text-left font-semibold text-gray-500">
              {joiner?.name.length < 15
                ? joiner?.name
                : `${joiner?.name.slice(0, 15)}...`}
            </p>
            {joiner?._id === roomCallState?.roomInfo?.owner?._id && (
              <JoinerTag name="Host" />
            )}
            {joiner?._id === userSate?.user?._id && <JoinerTag name="You" />}
          </div>

          <p className=" whitespace-nowrap text-left text-sm text-gray-400">
            {" "}
            {joiner?.email.length < 18
              ? joiner?.email
              : `${joiner?.email.slice(0, 15)}...`}
          </p>
        </div>
      </div>
      <div className="relative">
        <IconButton onClick={() => setOpen(!open)}>
          <MoreVertIcon className="text-gray-400" />
        </IconButton>
        {open && (
          <div>
            <div className="absolute right-1/2 top-1/2 transform bg-white shadow-md rounded-sm z-50">
              {roomCallState?.roomInfo?.owner._id === userSate?.user._id &&
                userSate?.user._id !== joiner._id && (
                  <div>
                    <button
                      onClick={() => BuzzHandler(joiner?._id)}
                      className="py-2 px-5 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-100 whitespace-nowrap"
                    >
                      Buzz
                    </button>
                    <button
                      onClick={() => KickHandler(joiner?._id)}
                      className=" p-2 px-5 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-100 whitespace-nowrap"
                    >
                      Kick
                    </button>
                  </div>
                )}
              <button className=" p-2 px-5 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-100 whitespace-nowrap">
                Info
              </button>
            </div>
            <div
              className="fixed top-0 left-0 w-full h-full z-40"
              onClick={() => {
                setOpen(false);
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(JoinerList);
