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
  CircularProgress,
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
import { actGetRoom, deleteRoomAction } from "./modules/action";
import { getInvitedRoomAPI } from "../../api/room.api";
import { renewToken } from "../../api/user.api";
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
const MyEvent = () => {
  const classes = useStyles();
  const listRoom = useSelector((state) => state.listRoomReducer);
  const userCurrent = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [roomEvent, setRoomEvent] = useState({});
  const [invitedRoom, setInvitedRoom] = useState([]);
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });

  useEffect(() => {
    dispatch(actGetRoom());
    getInvitedRoom();
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
      title: "Create Room",
      button: "Create",
      id: "tao",
    });
    setRoomEvent(null);
    setOpenDialog(true);
  };
  const handleUpdate = (roomEvent) => {
    setModal({
      title: "Update Room",
      button: "Update",
      id: "capnhat",
    });
    setRoomEvent(roomEvent);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const deleteRoom = (roomID) => {
    Swal.fire({
      icon: "question",
      title: "Delete Room",
      text: "Do you want delete this room ?",
      showCancelButton: true,
      confirmButtonText: "Agree",
      cancelButtonText: "Cancel",
    }).then((swalRes) => {
      if (swalRes.isConfirmed) {
        dispatch(
          deleteRoomAction(roomID, () => {
            Swal.fire({
              icon: "success",
              title: "Delete successfull !",
              showConfirmButton: false,
              timer: 1500,
            });
          })
        );
      }
    });
  };

  return (
    <>
      <div className={classes.root}>
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
          {(userCurrent?.user?.role === "ADMIN" ||
            userCurrent?.user?.role === "HOST") && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EventNoteIcon />}
                onClick={handleAdd}
                className="text-sm mb-2 md:text-md"
              >
                New Events
              </Button>
            )}

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
              {listRoom?.loading && <CircularProgress />}
              <Grid container spacing={4}>
                {listRoom?.data?.length > 0 ? (
                  listRoom?.data?.map((room, index) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} key={room._id}>
                      <Card sx={{ maxWidth: 345 }} className={classes.roomBox}>
                        <Link to={`/room/${room._id}`}
                          target='_blank'
                        >
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
                  <Grid item md={12}>
                    {!listRoom?.loading && (
                      <div className="flex">
                        <div className="bg-blue-100 shadow-inner p-4 rounded-md w-full">
                          <p className="text-gray-600">
                            You don't have any room
                          </p>
                          <p className="text-sm text-gray-500">
                            The rooms you create will be here
                          </p>
                        </div>
                      </div>
                    )}
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
                    <Grid item lg={3} md={4} sm={6} xs={12} key={room._id}>
                      <Card sx={{ maxWidth: 345 }} className={classes.roomBox}>
                        <Link to={`/room/${room._id}`}
                          target='_blank'
                        >
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
                        </CardContent>
                        <CardActions>
                          <div className="flex justify-center items-center ">
                            {room?.floors?.length} Floor
                          </div>
                          <div className="flex justify-center items-center ml-3">
                            {room?.memberCount + 1}
                            <PersonIcon fontSize="small" />
                          </div>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item md={12}>
                    {!listRoom?.loading && <div className="flex">
                      <div className="bg-blue-100 shadow-inner p-4 rounded-md w-full">
                        <p className="text-gray-600">
                          You don't have any invited room
                        </p>
                        <p className="text-sm text-gray-500">
                          The rooms you are invited or become member will be here
                        </p>
                      </div>
                    </div>}
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
