import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "react-avatar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { kickComfirmSwal, SendBuzzSwal } from "../../services/swalServier";

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
      console.log(value, id);
      roomCallState?.socket.emit("room:buzz", id, value);
    });
  };
  return (
    <div className="flex gap-4 items-center justify-between py-2 hover:bg-gray-100 px-2">
      <div className="flex items-center gap-4">
        {joiner?.picture ? (
          <img
            src={joiner?.picture}
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
        <p className=" whitespace-nowrap">
          {joiner?.name.length < 15
            ? joiner?.name
            : `${joiner?.name.slice(0, 15)}...`}
        </p>
      </div>
      <div className="relative">
        <IconButton onClick={() => setOpen(!open)}>
          <MoreVertIcon />
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
