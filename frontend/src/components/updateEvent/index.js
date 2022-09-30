import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import RemoveIcon from "@mui/icons-material/Remove";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Link, useParams } from "react-router-dom";
import * as yup from "yup";
import { Button, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  addTableAction,
  getTabelsAction,
  removeTableAction,
  tableSelectFloorAction,
} from "../../store/actions/tableActions";
import LinearProgress from "@mui/material/LinearProgress";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import { searchUserAPI } from "../../api/user.api";
import {
  addMembersAPI,
  addMembersByFileAPI,
  deleteFloorAPI,
  dowloadMemberCSVFileAPI,
  getRoomAPI,
  increaseFloorAPI,
  removeMemberAPI,
} from "../../api/room.api";
import { setGlobalNotification } from "../../store/reducers/globalNotificationReducer";
import { AboutFormatSwal, confirmSwal } from "../../services/swalServier";
import { LoadingButton } from "@mui/lab";

const roomSchema = yup.object().shape({
  name: yup.string().min(5).required(),
  numberOfSeat: yup.number().min(1).max(8).required(),
});

function UpdateEvent() {
  const { id } = useParams();
  const tables = useSelector((state) => state.tables);
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [room, setRoom] = useState(null);
  const [notFound, setNotFound] = useState(false);
  //members
  const [usersSelected, setUsersSelected] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  //floors
  const [floorsLoading, setFloorsLoading] = useState(false);
  //
  const { register, handleSubmit, errors, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(roomSchema),
  });

  useEffect(() => {
    getRoom("START", "ALL");
  }, []);

  const getRoom = async (position, loadingType) => {
    try {
      const res = await getRoomAPI(id);
      setRoom(res.data);
      const floors = res.data.floors;
      if (loadingType === "UPDATE_MEMBERS" || loadingType === "ALL") {
        setMembersLoading(false);
      }
      if (loadingType === "UPDATE_FLOORS" || loadingType === "ALL") {
        setFloorsLoading(false);
        if (position === "END") {
          dispatch(tableSelectFloorAction(id, floors[floors.length - 1]));
          return;
        }
        dispatch(tableSelectFloorAction(id, floors[0]));
      }
    } catch (err) {
      setNotFound(true);
    }
  };

  //tables
  const createTable = (data) => {
    const table = { ...data, room: id, floor: tables.currentFloor };
    dispatch(addTableAction(table));
    reset();
  };

  const onDelete = (tableId) => {
    Swal.fire({
      icon: "question",
      title: "remove table",
      text: "confirm",
      showCancelButton: true,
      confirmButtonText: "confirm",
      cancelButtonText: "cancel",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) dispatch(removeTableAction(tableId, id));
    });
  };

  const onDeleteFloor = async () => {
    try {
      confirmSwal("Delete this floor", "Are you sure", async () => {
        setFloorsLoading(true);
        await deleteFloorAPI(room._id, tables.currentFloor);
        await getRoom("START", "UPDATE_FLOORS");
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onIncreaseFloor = async () => {
    try {
      setFloorsLoading(true);
      await increaseFloorAPI(room._id, tables.currentFloor);
      await getRoom("END", "UPDATE_FLOORS");
    } catch (err) {
      console.log(err);
    }
  };

  //members
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
  };

  const onAddMember = async () => {
    setMembersLoading(true);
    try {
      const userIds = usersSelected.map((s) => s.value);
      await addMembersAPI(id, userIds);
      setUsersSelected(null);
      await getRoom(null, "UPDATE_MEMBERS");
    } catch (err) {
      console.log(err);
    }
  };

  const onFileChange = async (e) => {
    const files = e.target.files;
    if (!files[0]) return;

    const fd = new FormData();
    fd.append("importFile", files[0]);
    setMembersLoading(true);
    await addMembersByFileAPI(id, fd);
    await getRoom(null, "UPDATE_MEMBERS");
    e.target.value = null;
  };

  const onRemoveMember = async (userId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: "question",
        title: "remove member",
        text: "confirm",
        showCancelButton: true,
        confirmButtonText: "confirm",
        cancelButtonText: "cancel",
      });
      if (!isConfirmed) return;
      setMembersLoading(true);
      await removeMemberAPI(id, userId);
      await getRoom(null, "UPDATE_MEMBERS");
    } catch (err) {
      console.log(err);
    }
  };

  const onDownload = async () => {
    try {
      const data = await dowloadMemberCSVFileAPI(id);
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "text/csv" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `members-list.csv`);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch {}
  };

  return (
    <div>
      <div className="text-xl text-left p-4 font-semibold text-gray-500 flex items-center gap-4 border-b-2">
        <Link to="/user/my-event">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        Update Event
      </div>
      <div hidden={notFound} className="px-6 xl:px-16">
        <div className="py-4 shadow-md p-4">
          <div className="py-4 text-left">
            <p className="text-md font-semibold">Share link</p>
            <p className="text-gray-400 font-thin text-sm">
              The link is used to share for members to join the room
            </p>
          </div>
          <div className=" bg-gray-100 py-2 rounded-sm tracking-widest text-left px-3 text-gray-500 flex justify-between">
            <p>{`${window.location.origin.toString()}/room/${id}`}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin.toString()}/room/${id}`
                );
                dispatch(setGlobalNotification("success", "copied"));
              }}
            >
              <ContentCopyIcon></ContentCopyIcon>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 shadow-md p-4 mt-4">
          <div className="text-md col-span-3 text-left">
            <div className="h-2">{tables?.loading && <LinearProgress />}</div>
            <div className="flex items-center justify-between">
              <div>
                <p className=" font-semibold text-md">Tables</p>
                <p className="text-gray-400 font-thin text-sm">
                  The tables in the room are used by the members to sit and
                  divide the group
                </p>
              </div>
              <Link to={`/room/tables/${id}`} className="mr-4">
                <Button
                  className=" min-w-max"
                  variant="outlined"
                  color="primary"
                >
                  Manage Tables
                </Button>
              </Link>
            </div>
          </div>
          <div
            className="flex flex-col col-span-2 p-4"
            style={{ height: "700px" }}
          >
            <div className="grid grid-cols-3 px-4 py-1 bg-gray-200 rounded-md">
              <div className="col-span-2 text-left border-r-2 border-gray-300">
                name
              </div>
              <div className="text-left pl-3">number of seats</div>
            </div>
            <div className="flex-grow h-0 overflow-y-auto scroll-sm">
              {tables?.items?.map((s) => (
                <div
                  className="grid grid-cols-3 px-4 py-2 bg-gray-100 rounded-md mt-4 text-gray-500 text-sm"
                  key={s._id}
                >
                  <div className="col-span-2 text-left border-r-2 border-gray-300">
                    {s.name}
                  </div>
                  <div className="text-left pl-3 flex justify-between">
                    {s.numberOfSeat}
                    <button onClick={() => onDelete(s._id)}>
                      <RemoveIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-2">{floorsLoading && <LinearProgress />}</div>
            <div className="flex gap-4 items-center">
              <div className="grow-0 flex flex-col">
                <button
                  className="hover:text-blue-500 text-gray-500"
                  onClick={onIncreaseFloor}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button
                  className="hover:text-red-500  disabled:text-gray-200 text-gray-500"
                  onClick={onDeleteFloor}
                  disabled={room?.floors.length === 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
              <div className=" w-0 grow scroll-sm flex flex-row gap-4 border overflow-x-auto snap-x p-2">
                {room?.floors?.map((f, index) => (
                  <button
                    onClick={() => {
                      dispatch(tableSelectFloorAction(id, f));
                    }}
                    key={f}
                    className={`shadow-md p-1 whitespace-nowrap rounded text-sm font-thin text-gray-500 snap-start scroll-ml-4 ${
                      tables?.currentFloor === f && "shadow-lg bg-gray-200"
                    }`}
                  >
                    Floor {index}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="text-left text-md text-gray-500 font-semibold">
              Table
            </div>
            <form
              ref={formRef}
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(createTable)}
              noValidate
            >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="name"
                label="name"
                inputRef={register}
                error={!!errors.name}
                helperText={errors?.name?.message}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                name="numberOfSeat"
                label="number of seats"
                inputRef={register}
                error={!!errors.numberOfSeat}
                helperText={errors?.numberOfSeat?.message}
              />
              <LoadingButton
                variant="contained"
                type="submit"
                loading={tables?.loading}
              >
                Add
              </LoadingButton>
            </form>
          </div>
        </div>

        <div className="shadow-md p-4 mt-4">
          <div className="py-4 text-left">
            <p className="text-md font-semibold">Groups</p>
            <p className="text-gray-400 font-thin text-sm">
              Contains the permanent members of each table
            </p>
          </div>
          <div className="flex justify-start">
            <Link to={`/room/groups/${id}`} target="_blank">
              <Button variant="contained" type="submit">
                Manage groups
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 mt-4 border-b-2">
          <div className="flex justify-between col-span-3 p-4">
            <div className="text-xl font-semibold text-left">
              <p className=" font-semibold text-md"> Members </p>
              <p className="text-gray-400 font-thin text-sm">
                Users can join the room without sending a request
              </p>
              <p className="text-gray-400 font-thin text-sm">
                Invite only Users with Utemeeting account or signed in with
                google account at least once
              </p>
            </div>
            <div className="flex gap-2">
              <div>
                <Button variant="outlined">
                  <label>
                    Import by xlsx file
                    <input
                      type="file"
                      onChange={(e) => {
                        onFileChange(e);
                      }}
                      hidden
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                  </label>
                </Button>
                <p className="text-gray-400 font-thin text-sm">
                  Only files in our
                  <span
                    className="font-bold cursor-pointer hover:text-gray-500"
                    onClick={AboutFormatSwal}
                  >
                    format
                  </span>
                </p>
              </div>
              <div>
                <Button variant="contained" onClick={onDownload}>
                  Export to csv
                </Button>
              </div>
            </div>
          </div>
          <div
            className="flex flex-col col-span-2 p-4 shadow-md"
            style={{ height: "700px" }}
          >
            <div className="grid grid-cols-2 px-4 py-2 bg-gray-200 rounded-md">
              <div className="text-left border-r-2 border-gray-500">name</div>
              <div className="text-left pl-3">email</div>
            </div>
            <div className="flex-grow h-0 overflow-y-auto scroll-sm">
              {room &&
                room.members.map((u, index) => {
                  return (
                    <div
                      className="grid grid-cols-2 px-4 py-2 bg-gray-100 rounded-md mt-4 text-sm text-gray-500"
                      key={index}
                    >
                      <div className="text-left border-r-2 border-gray-300">
                        {u.name}
                      </div>
                      <div className="text-left pl-3 flex justify-between">
                        {u.email}
                        <button onClick={() => onRemoveMember(u._id)}>
                          <RemoveIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="p-4">
            <div className="text-left text-md text-gray-500 font-semibold">
              user
            </div>
            <div className=" flex flex-col gap-4">
              <AsyncSelect
                isMulti={true}
                noOptionsMessage={({ inputValue }) => (
                  <div>
                    Could not find a Utemeeting account matching {inputValue}{" "}
                  </div>
                )}
                defaultOptions={true}
                loadOptions={searchUser}
                value={usersSelected}
                onChange={onSelectChange}
              />
              <LoadingButton
                variant="contained"
                onClick={onAddMember}
                loading={membersLoading}
              >
                Add
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateEvent;
