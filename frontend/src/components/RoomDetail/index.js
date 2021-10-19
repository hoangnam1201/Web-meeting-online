import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { makeStyles } from "@material-ui/core";
import { Button } from "@mui/material";
import ChairTwoToneIcon from "@mui/icons-material/ChairTwoTone";
import IconButton from "@mui/material/IconButton";
import ToolBar from "./toolbar";
import { useDispatch, useSelector } from "react-redux";
import ManageDialog from "./ManageDialog";
import { actGetTable } from "./modules/action";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";
import InviteDialog from "./InviteDialog";
import CheckMedia from "../CheckMedia";
import { ScaleLoader } from "react-spinners";

const useStyles = makeStyles({
  root: {
    padding: "25px 15px",
    border: "1px solid gray",
    boxShadow: "5px 5px 5px 5px",
    marginBottom: "50px",
  },
  container: {
    background: "gray",
  },
  table: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid black",
    columnCount: "2",
    backgroundImage: `url("https://gachmenlinhphuong.com/wp-content/uploads/2019/06/G%E1%BA%A1ch-l%C3%A1t-n%E1%BB%81n-nh%C3%A0-lp56.jpg")`,

    "&:hover $btnDelete": {
      visibility: "visible",
      opacity: 1,
    },
  },
  chair: {
    margin: "10px 10px",
    width: "100px",
    height: "100px",
    textDecoration: "none",
    textAlign: "center",
  },
  toolBar: {
    // position: "sticky",
    // position: "-webkit-sticky",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9990",
    bottom: "10px",
    left: "400px",
    transform: "translate(-50)",
  },
  btnDelete: {
    position: "relative",
    left: "250px",
    padding: "20px",
    visibility: "hidden",
    opacity: 0,
    transition: "all .3s",
  },
  btnCreate: {
    margin: "15px 15px",
    display: "flex",
    justifyContent: "space-between",
  },
  loaderBox: {
    display: "inline-block",
    zIndex: "100",

    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
});
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const RoomDetail = (props) => {
  const classes = useStyles();
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const roomID = props.match.params.id;
  const dispatch = useDispatch();
  const listTableRoom = useSelector(
    (state) => state.listTableReducer?.data?.data
  );
  const [loading, setLoading] = useState(false);
  const [checkMedia, setCheckMedia] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [tableRoom, setTableRoom] = useState({});
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });
  const handleAdd = () => {
    setModal({
      title: "Tạo bàn",
      button: "Tạo",
      id: "tao",
    });
    setTableRoom({});
    setOpenDialog(true);
  };
  const handleAddMember = () => {
    setModal({
      title: "Thêm khách mời",
      button: "Thêm",
      id: "tao",
    });
    setOpenDialog2(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };
  useEffect(() => {
    setLoading(true);
    dispatch(actGetTable(roomID));
    return setLoading(false);
  }, [roomID]);

  const deleteTable = (tableID) => {
    Swal.fire({
      icon: "question",
      title: "Xóa bàn",
      text: "Bạn có thật sự muốn xóa bàn này ?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((swalRes) => {
      if (swalRes.isConfirmed) {
        setLoading(true);
        axios({
          url: `http://localhost:3002/api/table/${tableID}`,
          method: "DELETE",
          headers: {
            Authorization: `token ${accessToken.accessToken}`,
          },
        })
          .then((result) => {
            Swal.fire({
              icon: "success",
              title: "Xóa thành công",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              setLoading(false);
              dispatch(actGetTable(roomID));
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: error.response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };
  return (
    <>
      {!checkMedia ? (
        <CheckMedia checkMedia={checkMedia} setCheckMedia={setCheckMedia} />
      ) : (
        <>
          <Box className={classes.loaderBox}>
            <ScaleLoader
              color="#f50057"
              loading={loading}
              height={45}
              width={5}
              radius={10}
              margin={4}
            />
          </Box>
          <ManageDialog
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            handleCloseDialog={handleCloseDialog}
            modal={modal}
            roomID={roomID}
          />
          <InviteDialog
            openDialog2={openDialog2}
            setOpenDialog2={setOpenDialog2}
            handleCloseDialog2={handleCloseDialog2}
            modal={modal}
            roomID={roomID}
          />
          <div className={classes.btnCreate}>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              New Tables
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddMember}
            >
              Invite Peoples
            </Button>
          </div>
          <div className={classes.container}>
            <Box className={classes.root} sx={{ width: "100%" }}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {listTableRoom?.map((table, index) => (
                  <Grid item xs={6} key={index}>
                    <Item className={classes.table}>
                      <div>
                        <IconButton
                          className={classes.btnDelete}
                          onClick={() => deleteTable(table._id)}
                        >
                          <DeleteIcon fontSize="large" />
                        </IconButton>
                        <Grid
                          container
                          rowSpacing={1}
                          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                          <Grid item xs={6}>
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              component="span"
                              className={classes.chair}
                            >
                              <ChairTwoToneIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                          <Grid item xs={6}>
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              component="span"
                              className={classes.chair}
                            >
                              <ChairTwoToneIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                          <Grid item xs={6}>
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              component="span"
                              className={classes.chair}
                            >
                              <ChairTwoToneIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                          <Grid item xs={6}>
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              component="span"
                              className={classes.chair}
                            >
                              <ChairTwoToneIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <h5>{table?.name}</h5>
                      </div>
                    </Item>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <div className={classes.toolBar}>
              <ToolBar />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RoomDetail;
