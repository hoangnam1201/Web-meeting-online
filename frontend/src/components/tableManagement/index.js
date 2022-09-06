import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getTabelsAction,
  removeTableAction,
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

const TableManagement = (props) => {
  const { id } = useParams();
  const tables = useSelector((state) => state.tables);
  const dispatch = useDispatch();
  const [table, setTable] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });

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
  useEffect(() => {
    dispatch(getTabelsAction(id));
  }, []);
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
    <>
      <CreateDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleCloseDialog={handleCloseDialog}
        modal={modal}
        table={table}
      />
      <div className="h-24 flex items-center justify-between">
        <div className="text-xl text-left p-4 font-semibold text-gray-500 flex items-center gap-4 border-b-2">
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
          className="right-96 mr-96"
          onClick={handleAdd}
          variant="contained"
          color="primary"
        >
          Create table
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 relative z-0 grid-flow-row-dense px-2 pb-4">
        {tables?.items?.map((t) => {
          switch (t.numberOfSeat) {
            case 1:
              return (
                <div className="relative group">
                  <div className="absolute z-50 left-48 opacity-0 group-hover:opacity-100">
                    <IconButton onClick={() => onDelete(t._id)}>
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                  <Table1
                    key={t._id}
                    className="h-full overflow-hidden shadow"
                    data={t}
                  />
                </div>
              );
            case 2:
              return (
                <div className="relative group">
                  <div className="absolute z-50 left-48 opacity-0 group-hover:opacity-100">
                    <IconButton onClick={() => onDelete(t._id)}>
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                  <Table2
                    key={t._id}
                    className="h-full overflow-hidden shadow"
                    data={t}
                  />
                </div>
              );
            case 3:
              return (
                <div className="relative group">
                  <div className="absolute z-50 left-48 opacity-0 group-hover:opacity-100">
                    <IconButton onClick={() => onDelete(t._id)}>
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                  <Table3
                    key={t._id}
                    className="h-full overflow-hidden shadow"
                    data={t}
                  />
                </div>
              );
            case 4:
              return (
                <div className="relative group">
                  <div className="absolute z-50 left-48 opacity-0 group-hover:opacity-100">
                    <IconButton onClick={() => onDelete(t._id)}>
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                  <Table4
                    key={t._id}
                    className="h-full overflow-hidden shadow"
                    data={t}
                  />
                </div>
              );
            case 5:
              return (
                <div className="relative group col-span-2">
                  <div className="absolute z-50 left-96 translate-x-16 opacity-0 group-hover:opacity-100">
                    <IconButton onClick={() => onDelete(t._id)}>
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                  <Table5
                    key={t._id}
                    className="h-full col-span-2 overflow-hidden shadow"
                    data={t}
                  />
                </div>
              );
            case 6:
              return (
                <div className="relative group col-span-2">
                  <div className="absolute z-50 left-96 translate-x-16 opacity-0 group-hover:opacity-100">
                    <IconButton onClick={() => onDelete(t._id)}>
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                  <Table6
                    key={t._id}
                    className="h-full col-span-2 overflow-hidden shadow"
                    data={t}
                  />
                </div>
              );
            case 7:
              return (
                <div className="relative group col-span-2">
                  <div className="absolute z-50 left-96 translate-x-16 opacity-0 group-hover:opacity-100">
                    <IconButton onClick={() => onDelete(t._id)}>
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                  <Table7
                    key={t._id}
                    className="h-full col-span-2 overflow-hidden shadow"
                    data={t}
                  />
                </div>
              );
            default:
              return (
                <div className="relative group col-span-2">
                  <div className="absolute z-50 left-96 translate-x-16 opacity-0 group-hover:opacity-100">
                    <IconButton onClick={() => onDelete(t._id)}>
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                  <Table8
                    key={t._id}
                    className="h-full col-span-2 overflow-hidden shadow"
                    data={t}
                  />
                </div>
              );
          }
        })}
      </div>
    </>
  );
};

export default TableManagement;
