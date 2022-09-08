import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getTabelsAction,
  removeTableAction,
  tableSelectFloorAction,
} from "../../store/actions/tableActions";
import Table1 from "../roomCall/tables/table1";
import Table2 from "../roomCall/tables/table2";
import Table3 from "../roomCall/tables/table3";
import Table4 from "../roomCall/tables/tables4";
import Table5 from "../roomCall/tables/table5";
import Table6 from "../roomCall/tables/table6";
import Table7 from "../roomCall/tables/table7";
import Table8 from "../roomCall/tables/table8";
import { Button, IconButton } from "@mui/material";
import CreateDialog from "./createDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import {
  deleteFloorAPI,
  getRoomAPI,
  increaseFloorAPI,
} from "../../api/room.api";
import { confirmSwal } from "../../services/swalServier";

const TableManagement = (props) => {
  const { id } = useParams();
  const tables = useSelector((state) => state.tables);
  const dispatch = useDispatch();
  const [table, setTable] = useState({});
  const [room, setRoom] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });

  useEffect(() => {
    getRoom();
  }, []);

  const getRoom = async (position) => {
    try {
      const res = await getRoomAPI(id);
      setRoom(res.data);
      const floors = res.data.floors;
      if (position === "END") {
        dispatch(tableSelectFloorAction(id, floors[floors.length - 1]));
        return;
      }
      dispatch(tableSelectFloorAction(id, floors[0]));
    } catch (err) {
      setNotFound(true);
    }
  };

  const handleAdd = () => {
    setModal({
      title: "Tạo table",
      button: "Tạo",
      id: "tao",
    });
    setTable({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onDeleteFloor = async () => {
    try {
      confirmSwal("Delete this floor", "Are you sure", async () => {
        await deleteFloorAPI(room._id, tables.currentFloor);
        await getRoom();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onIncreaseFloor = async () => {
    try {
      await increaseFloorAPI(room._id, tables.currentFloor);
      await getRoom("END");
    } catch (err) {
      console.log(err);
    }
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
  return (
    <div className="px-6">
      <CreateDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleCloseDialog={handleCloseDialog}
        modal={modal}
        table={table}
      />
      <div className="flex items-center justify-between border-b-2 ">
        <div className="text-xl text-left p-4 font-semibold text-gray-500 flex items-center gap-4">
          <Link to={`/user/update-event/${id}`}>
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
          Back
        </div>
        <Button
          onClick={handleAdd}
          variant="contained"
          color="primary"
          className="mr-6"
        >
          Create table
        </Button>
      </div>
      <div className="py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 relative z-0 grid-flow-row-dense px-2">
          {tables?.items?.map((t, index) => {
            switch (t.numberOfSeat) {
              case 1:
                return (
                  <div className="relative group" key={index}>
                    <div className="absolute right-0 top-0 transform z-10 opacity-0 group-hover:opacity-100">
                      <IconButton onClick={() => onDelete(t._id)}>
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                    <Table1
                      key={t._id}
                      className="h-full overflow-hidden shadow relative z-0"
                      data={t}
                    />
                  </div>
                );
              case 2:
                return (
                  <div className="relative group" key={index}>
                    <div className="absolute right-0 top-0 transform z-10 opacity-0 group-hover:opacity-100">
                      <IconButton onClick={() => onDelete(t._id)}>
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                    <Table2
                      key={t._id}
                      className="h-full overflow-hidden shadow z-0 relative"
                      data={t}
                    />
                  </div>
                );
              case 3:
                return (
                  <div className="relative group" key={index}>
                    <div className="absolute right-0 top-0 transform z-10 opacity-0 group-hover:opacity-100">
                      <IconButton onClick={() => onDelete(t._id)}>
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                    <Table3
                      key={t._id}
                      className="h-full overflow-hidden shadow relative z-0"
                      data={t}
                    />
                  </div>
                );
              case 4:
                return (
                  <div className="relative group" key={index}>
                    <div className="absolute right-0 top-0 transform z-10 opacity-0 group-hover:opacity-100">
                      <IconButton onClick={() => onDelete(t._id)}>
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                    <Table4
                      key={t._id}
                      className="h-full overflow-hidden shadow relative z-0"
                      data={t}
                    />
                  </div>
                );
              case 5:
                return (
                  <div className="relative group col-span-2" key={index}>
                    <div className="absolute z-50 left-96 translate-x-16 opacity-0 group-hover:opacity-100">
                      <IconButton onClick={() => onDelete(t._id)}>
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                    <Table5
                      key={t._id}
                      className="h-full col-span-2 overflow-hidden shadow relative z-0"
                      data={t}
                    />
                  </div>
                );
              case 6:
                return (
                  <div className="relative group col-span-2" key={index}>
                    <div className="absolute z-50 left-96 translate-x-16 opacity-0 group-hover:opacity-100">
                      <IconButton onClick={() => onDelete(t._id)}>
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                    <Table6
                      key={t._id}
                      className="h-full col-span-2 overflow-hidden shadow relative z-0"
                      data={t}
                    />
                  </div>
                );
              case 7:
                return (
                  <div className="relative group col-span-2" key={index}>
                    <div className="absolute z-50 left-96 translate-x-16 opacity-0 group-hover:opacity-100">
                      <IconButton onClick={() => onDelete(t._id)}>
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                    <Table7
                      key={t._id}
                      className="h-full col-span-2 overflow-hidden shadow relative z-0"
                      data={t}
                    />
                  </div>
                );
              default:
                return (
                  <div className="relative group col-span-2" key={index}>
                    <div className="absolute z-50 left-96 translate-x-16 opacity-0 group-hover:opacity-100">
                      <IconButton onClick={() => onDelete(t._id)}>
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                    <Table8
                      key={t._id}
                      className="h-full col-span-2 overflow-hidden shadow relative z-0"
                      data={t}
                    />
                  </div>
                );
            }
          })}
          <div
            className=" bg-gray-200 text-white flex justify-center items-center border-4 border-gray-300 hover:bg-gray-100 hover:cursor-pointer h-80"
            onClick={handleAdd}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="4"
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        </div>
      </div>
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
  );
};

export default TableManagement;
