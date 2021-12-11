import React, { useEffect, useState } from "react";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Container, Grid } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ImgMeeting from "../../assets/meeting.jpg";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import ManageDialog from "./ManageDialog";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { actGetRoom } from "./modules/action";
import { useCookies } from "react-cookie";

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
    display: 'block',
    opacity: 0,
    transition: "all .3s",
  },
  groupButton: {
    display: "flex",
    alignItems: 'center'
  },
});
const MyEvent = (props) => {
  const classes = useStyles();
  const [cookies, setCookies] = useCookies(['u_auth'])
  const listRoom = useSelector((state) => state.listRoomReducer?.data?.data);

  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [roomEvent, setRoomEvent] = useState({});
  const [invitedRoom, setInvitedRoom] = useState([]);
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });

  const getInvitedRoom = async () => {
    try {
      const fetch = {
        url: "http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/room/invited-room",
        method: "GET",
        headers: {
          Authorization: `token ${cookies.u_auth.accessToken}`,
        },
      };
      const res = await axios(fetch);
      setInvitedRoom(res?.data?.data);
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
        axios({
          url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/room/${roomID}`,
          method: "DELETE",
          headers: {
            Authorization: `token ${cookies.u_auth.accessToken}`,
          },
        })
          .then((result) => {
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<EventNoteIcon />}
          onClick={handleAdd}
        >
          New Events
        </Button>
        <Container component="div" maxWidth="lg">
          <Grid container>
            <Grid item>
              <Typography
                variant="h2"
                color="primary"
                component="p"
                className={classes.title}
              >
                My Events
              </Typography>
            </Grid>
          </Grid>

          <div>
            <Grid container spacing={4} className={classes.courseListContainer}>
              {listRoom?.map((room, index) => (
                <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
                  <Card sx={{ maxWidth: 345 }} className={classes.roomBox}>
                    <Link to={`/room/id/${room._id}`}>
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
                        <div className={classes.roomButton} >
                          <IconButton
                            onClick={() => handleUpdate(room)}
                          >
                            <EditIcon fontSize="medium" />
                          </IconButton>
                        </div>
                        <div className={classes.roomButton} >
                          <IconButton
                            onClick={() => deleteRoom(room?._id)}
                          >
                            <DeleteIcon fontSize="medium" />
                          </IconButton>

                        </div>
                        <div
                          className={classes.roomButton} >
                          <Button>
                            <Link
                              className='block w-full h-full'
                              to={`/user/update-event/${room?._id}`}
                            >
                              <MoreVertIcon fontSize='medium' />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<PersonIcon />}>
                        0/50
                      </Button>
                      <Button size="small">0 sponsor</Button>
                      <Button size="small">1 floor</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
          <Grid className="mt-5" container>
            <Grid item>
              <Typography
                variant="h2"
                color="primary"
                component="p"
                className={classes.title}
              >
                Invited Events
              </Typography>
            </Grid>
          </Grid>
          <div>
            <Grid container spacing={4} className={classes.courseListContainer}>
              {invitedRoom ? (
                invitedRoom?.map((room, index) => (
                  <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
                    <Card sx={{ maxWidth: 345 }} className={classes.roomBox}>
                      <Link to={`/room/id/${room._id}`}>
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
                        <Button size="small" startIcon={<PersonIcon />}>
                          0/50
                        </Button>
                        <Button size="small">0 sponsor</Button>
                        <Button size="small">1 floor</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item>
                  <h2>Bạn không có sự kiện nào được mời !!!</h2>
                </Grid>
              )}
            </Grid>
          </div>
        </Container>
      </section>
    </div >
  );
};

export default MyEvent;
