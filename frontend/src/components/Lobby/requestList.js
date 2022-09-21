import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "react-avatar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { roomRemoveRequestAction } from "../../store/actions/roomCallAction";

const RequestList = ({ requests }) => {
  return (
    <div>
      {requests?.map((user, index) => (
        <RequestItem request={user} key={index} />
      ))}
    </div>
  );
};

const RequestItem = ({ request }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const roomCallState = useSelector((state) => state.roomCall);

  const replyHandler = (isAccept) => {
    roomCallState?.socket.emit(
      "room:access-request",
      request.socketId,
      request.user._id,
      isAccept
    );
    dispatch(roomRemoveRequestAction(request.user._id));
  };

  return (
    <div className="flex gap-4 items-center justify-between py-2 hover:bg-gray-100 px-2">
      {request?.picture ? (
        <div className="flex items-center gap-4">
          <img
            src={request.user?.picture}
            alt=""
            className="cursor-pointer rounded-full w-12"
          />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Avatar
            name={request.user?.name}
            size="48"
            round={true}
            className="cursor-pointer"
          />
        </div>
      )}
      <div className="w-0 flex-grow overflow-x-hidden">
        <p className="whitespace-nowrap text-left font-semibold text-gray-500">
          {request.user?.name.length < 15
            ? request.user?.name
            : `${request.user?.name.slice(0, 15)}...`}
        </p>
        <p className=" whitespace-nowrap text-left text-sm text-gray-400">
          {" "}
          {request.user?.email.length < 18
            ? request.user?.email
            : `${request.user?.email.slice(0, 15)}...`}
        </p>
      </div>
      <div className="relative">
        <IconButton onClick={() => setOpen(!open)}>
          <MoreVertIcon />
        </IconButton>
        {open && (
          <div>
            <div className="flex flex-col absolute right-1/2 top-1/2 transform bg-white shadow-md rounded-sm z-50">
              <button
                onClick={() => replyHandler(true)}
                className="py-2 px-5 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-100 whitespace-nowrap"
              >
                Accept
              </button>
              <button
                onClick={() => replyHandler(false)}
                className=" p-2 px-5 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-100 whitespace-nowrap"
              >
                Refuse
              </button>
              <button className="p-2 px-5 text-gray-500 focus:outline-none text-sm font-semibold capitalize hover:bg-gray-100 whitespace-nowrap">
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

export default React.memo(RequestList);
