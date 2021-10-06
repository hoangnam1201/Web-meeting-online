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
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { actGetRoom } from "./modules/action";
import moment from "moment";
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
    position: "absolute",
    top: "10px",
    left: 0,
    padding: "15px",
    fontSize: "18px",
    textAlign: "center",
    visibility: "hidden",
    opacity: 0,
    transition: "all .3s",
  },
  groupButton: {
    display: "flex",
  },
});
const MyEvent = (props) => {
  const classes = useStyles();
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const listRoom = useSelector(
    (state) => state.listRoomReducer?.data?.data?.docs
  );
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [roomEvent, setRoomEvent] = useState({});
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });
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
          url: `http://localhost:3002/api/room/${roomID}`,
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
                My Event
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
                        {Date(room?.startDate)}
                      </Typography>
                      <Typography
                        className={classes.date}
                        variant="body2"
                        color="text.secondary"
                      >
                        {Date(room?.endDate)}
                      </Typography>
                      <div className={classes.groupButton}>
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
        </Container>
      </section>
    </div>
  );
};

export default MyEvent;
