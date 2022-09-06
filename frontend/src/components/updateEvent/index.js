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
} from "../../store/actions/tableActions";
import LinearProgress from "@mui/material/LinearProgress";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import { searchUserAPI } from "../../api/user.api";
import { addMembersAPI, getRoomAPI, removeMemberAPI } from "../../api/room.api";
import { setGlobalNotification } from "../../store/reducers/globalNotificationReducer";

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
  const [selected, setSelected] = useState([]);
  const { register, handleSubmit, errors, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(roomSchema),
  });

  useEffect(() => {
    dispatch(getTabelsAction(id));
    getRoom();
  }, []);

  const getRoom = async () => {
    try {
      const res = await getRoomAPI(id);
      setRoom(res.data);
    } catch (err) {
      setNotFound(true);
    }
  };

  const createTable = (data) => {
    const table = { ...data, room: id };
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

  const searchUser = (str, callback) => {
    searchUserAPI(str).then((res) => {
      const options = res.data.map((u) => {
        return { label: `${u.username} (${u.email})`, value: u._id };
      });
      callback(options);
    });
  };

  const onSelectChange = (e) => {
    setSelected(e);
  };

  const onAddMember = async () => {
    try {
      const userIds = selected.map((s) => s.value);
      await addMembersAPI(id, userIds);
      setSelected(null);
      await getRoom();
    } catch (err) {
      console.log(err);
    }
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
      const res = await removeMemberAPI(id, userId);
      console.log(res);
      await getRoom();
    } catch (err) {
      console.log(err);
    }
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
            {tables?.loading && <LinearProgress />}
            <div className="flex items-center justify-between">
              <div>
                <p className=" font-semibold text-md">Tables</p>
                <p className="text-gray-400 font-thin text-sm">
                  The tables in the room are used by the members to sit and
                  divide the group
                </p>
              </div>
              <Link to={`/room/tables/${id}`}>
                <Button
                  className="right-64 mr-52"
                  variant="contained"
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
              <Button variant="contained" type="submit">
                Add
              </Button>
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
          <div className="text-xl font-semibold col-span-3 text-left p-4">
            <p className=" font-semibold text-md"> Members </p>
            <p className="text-gray-400 font-thin text-sm">
              Users can join the room without sending a request
            </p>
          </div>
          <div
            className="flex flex-col col-span-2 p-4 shadow-md"
            style={{ height: "700px" }}
          >
            <div className="grid grid-cols-2 px-4 py-2 bg-gray-200 rounded-md">
              <div className="text-left border-r-2 border-gray-500">
                username
              </div>
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
                        {u.username}
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
                loadOptions={searchUser}
                value={selected}
                onChange={onSelectChange}
              />
              <Button variant="contained" onClick={onAddMember}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateEvent;
