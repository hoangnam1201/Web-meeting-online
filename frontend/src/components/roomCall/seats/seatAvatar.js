import { Popover } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import { kickComfirmSwal, SendBuzzSwal } from "../../../services/swalServier";

const SeatAvatar = React.memo(({ user, ...rest }) => {
  const [open, setOpen] = useState(false);
  const roomCallState = useSelector((state) => state.roomCall);
  const userSate = useSelector((state) => state.userReducer);

  useEffect(() => {
    setOpen(false);
  }, [user]);

  const clickHandler = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const closeHandler = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  const KickHandler = (e, id) => {
    e.stopPropagation();
    kickComfirmSwal((value) => {
      roomCallState?.socket.emit("room:kick", id, !!value);
    });
  };

  const BuzzHandler = (e, id) => {
    e.stopPropagation();
    SendBuzzSwal((value) => {
      roomCallState?.socket.emit("room:buzz", id, value);
    });
  };

  return (
    <div className="absolute flex items-center" {...rest}>
      {user &&
        (user?.picture ? (
          <button onClick={clickHandler} className="outline-none">
            <img
              className="rounded-full shadow-lg"
              src={user?.picture}
              alt=""
              width={50}
              height={50}
            />
          </button>
        ) : (
          <div>
            <button onClick={clickHandler} className="outline-none">
              <Avatar
                onClick={() => {}}
                name={user?.name}
                size="50"
                round={true}
                className="shadow-md"
              />
            </button>
          </div>
        ))}
      {open && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full z-40"
            onClick={closeHandler}
          ></div>
          <div className="p-1 flex flex-col absolute bg-gray-50 z-50 left-full top-0 rounded-lg shadow-lg">
            {roomCallState?.roomInfo?.owner?._id === userSate?.user?._id &&
              userSate?.user?._id !== user?._id && (
                <>
                  <button
                    className="rounded-lg border-b hover:shadow px-4 py-1"
                    onClick={(e) => {
                      KickHandler(e, user?._id);
                    }}
                  >
                    Kick
                  </button>
                  <button
                    className="rounded-lg border-b hover:shadow px-4 py-1"
                    onClick={(e) => {
                      BuzzHandler(e, user?._id);
                    }}
                  >
                    Buzz
                  </button>
                </>
              )}
            <button className="rounded-lg border-b hover:shadow px-4 py-1">
              Info
            </button>
          </div>
        </>
      )}
    </div>
  );
});

export default SeatAvatar;
