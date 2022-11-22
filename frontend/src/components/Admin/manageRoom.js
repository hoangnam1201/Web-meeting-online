import React, { useEffect } from "react";
import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import {
  banRoomAction,
  getRoomPagingAction,
  unbanRoomAction,
} from "../../store/actions/roomAction";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";
import { searchUserAPI } from "../../api/user.api";

const ManageRoom = () => {
  const room = useSelector((state) => state.roomManageReducer);
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [usersSelected, setUsersSelected] = useState(null);

  useEffect(() => {
    dispatch(
      getRoomPagingAction(
        pageIndex,
        usersSelected?.value
      ))
  }, [])


  const banRoom = (roomId) => {
    Swal.fire({
      icon: "question",
      title: "Lock room",
      text: "confirm",
      showCancelButton: true,
      confirmButtonText: "confirm",
      cancelButtonText: "cancel",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) dispatch(banRoomAction(roomId, pageIndex));
    });
  };

  const unbanRoom = (roomId) => {
    Swal.fire({
      icon: "question",
      title: "Unlock room",
      text: "confirm",
      showCancelButton: true,
      confirmButtonText: "confirm",
      cancelButtonText: "cancel",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) dispatch(unbanRoomAction(roomId, pageIndex));
    });
  };

  const onPageChage = (page) => {
    setPageIndex(page)
    dispatch(
      getRoomPagingAction(
        page,
        usersSelected?.value
      ))
  }

  const searchUser = (str, callback) => {
    searchUserAPI(str).then((res) => {
      const options = res.data.map((u) => {
        return { label: `${u.name} (${u.email})`, value: u._id };
      });
      callback(options);
    });
  };

  const onSelectChange = (e) => {
    setUsersSelected(e);
    setPageIndex(0);
    dispatch(
      getRoomPagingAction(
        0,
        e && e.value
      )
    )
  };

  return (
    <div>
      <div className="shadow-md p-4 mt-4">
        <div className="py-4 text-left flex items-center gap-4">
          <div>
            <p className="text-lg font-semibold">Event Room Management</p>
            <p className="text-gray-400 font-thin text-sm">
              The tables management event room in system
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div
            className="flex flex-col col-span-3 shadow-md p-2"
            style={{ height: "650px" }}
          >
            <div
              className="mb-4 p-1 self-start w-64 justify-start"
            >
              <p className="text-left font-bold">owner</p>
              <AsyncSelect
                isClearable={true}
                noOptionsMessage={({ inputValue }) => (
                  <div>
                    Could not find a Utemeeting account matching {inputValue}{" "}
                  </div>
                )}
                defaultOptions={true}
                filterOption={(o) => o.value}
                loadOptions={searchUser}
                value={usersSelected}
                onChange={onSelectChange}
              />
            </div>
            {room?.loading && <LinearProgress />}
            <div className="grid grid-cols-3 px-4 py-2 bg-gray-200 rounded-md font-bold">
              <div className="text-left border-r-2 border-gray-500">Name</div>
              <div className="text-left pl-3 border-r-2 border-gray-500">
                Owner room
              </div>
              <div className="text-center pl-3">Status</div>
            </div>
            <div className="flex-grow h-0 overflow-y-auto scroll-sm">
              {room?.items?.map((r) => {
                return (
                  <div key={r._id} className="group rounded-md mt-3 ">
                    <div className="grid grid-cols-3 px-4 py-2 bg-gray-100 rounded-md text-sm text-gray-500 shadow-md group-hover:bg-slate-300">
                      <div className="text-left border-r-2 border-gray-300 flex items-center">
                        {r?.name}
                      </div>
                      <div className="text-left pl-3 border-r-2 border-gray-300 flex items-center">
                        {r?.owner?.name}
                      </div>
                      <div className="pl-3 flex items-center justify-center">
                        {r?.state === "OPENING" ? (
                          <IconButton
                            onClick={() => banRoom(r._id)}
                            className="bg-green-200 w-7 h-7"
                          >
                            <LockOpenIcon className="text-green-600" />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => unbanRoom(r._id)}
                            className="bg-red-200 w-7 h-7"
                          >
                            <LockIcon className="text-red-600" />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end">
              <Stack spacing={2}>
                <Pagination
                  count={room?.totalPages}
                  onChange={(e, value) => onPageChage(value - 1)}
                  color="primary"
                  page={pageIndex + 1}
                />
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRoom;
