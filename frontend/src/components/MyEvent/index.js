import React, { useEffect, useState } from "react";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Box,
} from "@mui/material";
import ImgMeeting from "../../assets/meeting.jpg";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import ManageDialog from "./ManageDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { actGetRoom } from "./modules/action";
import meetingIcon from "../../assets/meetingIcon1.png";
import { deleteRoomAPI, getInvitedRoomAPI } from "../../api/room.api";
import { renewToken } from "../../api/user.api";
import { ScaleLoader } from "react-spinners";
import PersonIcon from "@mui/icons-material/Person";

const useStyles = makeStyles({
  root: {
    padding: "40px 0",
    margin: "5px 10px",
  },
  title: {
    display: "inline-block",
    fontSize: "24px",
    marginBottom: "20px",

    position: "relative",
    "&::after": {
      position: "absolute",
      display: "block",
      content: "''",

      bottom: "-5px",
      left: "0",

      height: "2px",
      width: "120%",

      backgroundColor: "#0E1E40",
    },
  },
  courseListContainer: {
    marginTop: "10px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  date: {
    fontWeight: "bold",
  },
  roomBox: {
    "&:hover $roomButton": {
      visibility: "visible",
      opacity: 1,
    },
  },
  roomButton: {
    top: "10px",
    left: 0,
    textAlign: "center",
    visibility: "hidden",
    display: "block",
    opacity: 0,
    transition: "all .3s",
  },
  groupButton: {
    display: "flex",
    alignItems: "center",
  },
});
const MyEvent = (props) => {
  const classes = useStyles();
  const listRoom = useSelector((state) => state.listRoomReducer?.data?.data);

  console.log("listRoom", listRoom);

  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [roomEvent, setRoomEvent] = useState({});
  const [invitedRoom, setInvitedRoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });

  useEffect(() => {
    renewToken();
  }, []);

  const getInvitedRoom = async () => {
    try {
      const res = await getInvitedRoomAPI();
      setInvitedRoom(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = () => {
    setModal({
      title: "Tạo room",
      button: "Tạo",
      id: "tao",
    });
    setRoomEvent({});
    setOpenDialog(true);
  };
  const handleUpdate = (roomEvent) => {
    setModal({
      title: "Cập nhật phòng họp",
      button: "Cập nhật",
      id: "capnhat",
    });
    setRoomEvent(roomEvent);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    dispatch(actGetRoom());
    getInvitedRoom();
  }, []);

  const deleteRoom = (roomID) => {
    Swal.fire({
      icon: "question",
      title: "Xóa phòng họp",
      text: "Bạn có thật sự muốn xóa phòng này ?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((swalRes) => {
      if (swalRes.isConfirmed) {
        setLoading(true);
        deleteRoomAPI(roomID)
          .then((result) => {
            setLoading(false);
            Swal.fire({
              icon: "success",
              title: "Xóa thành công",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              dispatch(actGetRoom());
            });
          })
          .catch((error) => {
            setLoading(false);
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
      <Box className="z-100 inline-block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ScaleLoader
          color="#f50057"
          loading={loading}
          height={45}
          width={5}
          radius={10}
          margin={4}
        />
      </Box>
      <div className={`${classes.root} ${loading ? `opacity-50` : null}`}>
        <Helmet>
          <title>My Event</title>
          <meta charSet="utf-8" name="description" content="Home" />
        </Helmet>
        <ManageDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          handleCloseDialog={handleCloseDialog}
          modal={modal}
          roomEvent={roomEvent}
        />
        <section>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EventNoteIcon />}
            onClick={handleAdd}
          >
            New Events
          </Button>
          <Container component="div" maxWidth="xl">
            <Grid container>
              <Grid item>
                <Typography
                  variant="h4"
                  color="primary"
                  component="p"
                  className={classes.title}
                >
                  My Events
                </Typography>
              </Grid>
            </Grid>

            <div className="mt-5">
              <Grid
                container
                spacing={4}
                className={classes.courseListContainer}
              >
                {listRoom?.length > 0 ? (
                  listRoom?.map((room, index) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
                      <Card sx={{ maxWidth: 345 }} className={classes.roomBox}>
                        <Link to={`/room/${room._id}`}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={ImgMeeting}
                            alt="green iguana"
                          />
                        </Link>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h7" component="div">
                            {room?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {room?.description}
                          </Typography>
                          <Typography
                            className={classes.date}
                            variant="body2"
                            color="text.secondary"
                          >
                            {new Date(room?.startDate).toDateString()}
                          </Typography>
                          <Typography
                            className={classes.date}
                            variant="body2"
                            color="text.secondary"
                          >
                            {new Date(room?.endDate).toDateString()}
                          </Typography>
                          <div className={classes.groupButton}>
                            <div className={classes.roomButton}>
                              <IconButton onClick={() => handleUpdate(room)}>
                                <EditIcon fontSize="medium" />
                              </IconButton>
                            </div>
                            <div className={classes.roomButton}>
                              <IconButton onClick={() => deleteRoom(room?._id)}>
                                <DeleteIcon fontSize="medium" />
                              </IconButton>
                            </div>
                            <div className={classes.roomButton}>
                              <Button>
                                <Link
                                  className="block w-full h-full"
                                  to={`/user/update-event/${room?._id}`}
                                >
                                  <MoreVertIcon fontSize="medium" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                        <CardActions>
                          <div className="flex justify-center items-center ">
                            {room.floors.length} Floor
                          </div>
                          <div className="flex justify-center items-center ml-3">
                            {room.memberCount + 1}
                            <PersonIcon fontSize="small" />
                          </div>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item md={9}>
                    <div className="flex justify-center flex-col items-center">
                      <img src={meetingIcon} width={100} height={100} />
                      <h2 className="font-bold">
                        Bạn không có sự kiện nào !!!
                      </h2>
                    </div>
                  </Grid>
                )}
              </Grid>
            </div>
            <Grid className="mt-5" container>
              <Grid item>
                <Typography
                  variant="h4"
                  color="primary"
                  component="p"
                  className={classes.title}
                >
                  Invited Events
                </Typography>
              </Grid>
            </Grid>
            <div className="mt-5">
              <Grid
                container
                spacing={4}
                className={classes.courseListContainer}
              >
                {invitedRoom.length > 0 ? (
                  invitedRoom?.map((room, index) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
                      <Card sx={{ maxWidth: 345 }} className={classes.roomBox}>
                        <Link to={`/room/${room._id}`}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={ImgMeeting}
                            alt="green iguana"
                          />
                        </Link>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h7" component="div">
                            {room?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {room?.description}
                          </Typography>
                          <Typography
                            className={classes.date}
                            variant="body2"
                            color="text.secondary"
                          >
                            {new Date(room?.startDate).toDateString()}
                          </Typography>
                          <Typography
                            className={classes.date}
                            variant="body2"
                            color="text.secondary"
                          >
                            {new Date(room?.endDate).toDateString()}
                          </Typography>
                          {/* <div className={classes.groupButton}>
                          <IconButton
                            className={classes.roomButton}
                            onClick={() => handleUpdate(room)}
                          >
                            <EditIcon fontSize="medium" />
                          </IconButton>
                          <IconButton
                            className={classes.roomButton}
                            onClick={() => deleteRoom(room?._id)}
                          >
                            <DeleteIcon fontSize="medium" />
                          </IconButton>
                        </div> */}
                        </CardContent>
                        <CardActions>
                          <Button size="small">1 floor</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item md={9}>
                    <div className="flex justify-center flex-col items-center">
                      <img src={meetingIcon} width={100} height={100} />
                      <h2 className="font-bold">
                        Bạn không có sự kiện nào được mời !!!
                      </h2>
                    </div>
                  </Grid>
                )}
              </Grid>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default MyEvent;
