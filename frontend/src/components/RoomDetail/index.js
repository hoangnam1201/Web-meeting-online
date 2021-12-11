import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import backgroundRoom from "../../assets/backgroundRoom.png";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { makeStyles } from "@material-ui/core";
import { Button } from "@mui/material";
import ChairTwoToneIcon from "@mui/icons-material/ChairTwoTone";
import IconButton from "@mui/material/IconButton";
import ToolBar from "./toolbar";
import { useDispatch, useSelector } from "react-redux";
import ManageDialog from "./ManageDialog";
import { actGetTable, actStopStream } from "./modules/action";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";
import InviteDialog from "./InviteDialog";
import CheckMedia from "../CheckMedia";
import { ScaleLoader } from "react-spinners";
import MyVideoCall from "./myVideoCall";
import io from "socket.io-client";
import Peer from "peerjs";
import { useCookies } from 'react-cookie';
import Avatar from "react-avatar";

const useStyles = makeStyles({
  root: {
    padding: "25px 15px",
    border: "1px solid gray",
    boxShadow: "5px 5px 5px 5px",
    marginBottom: "50px",
  },
  container: {
    backgroundImage: `url(${backgroundRoom})`,
  },
  table: {
    display: "flex",
    height: "275px",
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

  const [cookies] = useCookies(['u_auth']);

  //redux
  const listTableRoom = useSelector((state) => state.listTableReducer?.data?.data);
  const currentUser = useSelector(state => state.userReducer);
  const socketRoomReducer = useSelector((state) => state.socketRoomReducer);
  const myStream = useSelector(state => state.streamReducer);
  const mediaOption = useSelector(state => state.mediaReducer);
  const dispatch = useDispatch();
  //params
  const roomID = props.match.params.id;
  //states
  const [loading, setLoading] = useState(false);
  const [checkMedia, setCheckMedia] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [tableRoom, setTableRoom] = useState({});
  const [member, setMember] = useState([]);
  const [socketTable, setSocketTable] = useState(null);
  const [tableMessages, setTableMessages] = useState([]);
  const [userCall, setUserCall] = useState([]);
  const [peer, setPeer] = useState(null);
  const [joinTables, setJoinTables] = useState(false);
  const [ownerRoom, setOwnerRoom] = useState([]);

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
    if (peer && myStream) {
      peer.on("call", (call) => {
        console.log('answare tracks',myStream.stream?.getTracks());
        call.answer(myStream.stream);
      });
    }
    return () => {
      if (peer) peer.off("call");
    };
  }, [myStream]);

  useEffect(() => {
    setLoading(true);
    dispatch(actGetTable(roomID));
    return setLoading(false);
  }, [roomID]);

  useEffect(() => {
    if (socketRoomReducer.isConnect) {
      const socket = socketRoomReducer.socket;
      socket.on("room:user-joined", (data) => {
        setMember(data);
      });
      socket.on("room:joined", (room) => {
        setOwnerRoom(room);
      });
    }

    return () => {
      if (socketRoomReducer.isConnect) {
        const socketRoom = socketRoomReducer.socket;
        socketRoom.off("room:user-joined");
        socketRoom.off("room:joined");
      }
    };
  }, [socketRoomReducer]);

  useEffect(() => {
    const _peer = new Peer(undefined, {
      host: "ec2-54-161-198-205.compute-1.amazonaws.com",
      path: "/peerjs/meeting",
      port: 3002,
    });

    _peer.on("open", (id) => {
      setPeer(_peer);
    });

    _peer.on("disconnected", () => {
      console.log("disconnected");
    });
    const tokenValue = "Beaner " + cookies.u_auth.accessToken;
    setSocketTable(
      io("http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/socket/tables", {
        forceNew: true,
        auth: {
          token: tokenValue,
          roomId: roomID,
        },
      })
    );

    return () => {
      dispatch(actStopStream());
      socketTable?.disconect();
    }
  }, []);

  useEffect(() => {
    if (socketTable) {
      socketTable.on("table:message", (data) => {
        setTableMessages((pervMessage) => {
          return [...pervMessage, data];
        });
      });
      socketTable.on("table:join-success", (data) => {
        setTableMessages([]);
      });
      socketTable.on("table:user-joined", (data) => {
        console.log('join', data)
        setUserCall([...data]);
      });
      socketTable.on("table:user-leave", (data) => {
        console.log('leave', data)
        setUserCall([...data]);
      });
      socketTable.on('table:change-media', (data) => {
        console.log('change', data)
        setUserCall([...data]);
      })
    }
    return () => {
      socketTable?.offAny();
    }
  }, [socketTable]);

  const joinTable = (tableId) => {
    setTableMessages([]);
    setJoinTables(true);
    socketTable.emit("table:join", tableId, { ...mediaOption }, peer.id);
  };

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
          url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/table/${tableID}`,
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
        <CheckMedia
          checkMedia={checkMedia}
          roomId={roomID}
          setCheckMedia={setCheckMedia}
          peer={peer}
        />
      ) : (
        <div className='min-h-screen'>
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
          <div>
            {currentUser?.user?._id === ownerRoom?.owner?._id ? (
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
            ) : (
              ""
            )}

            <div className='flex fixed left-1/2 top-11 z-50 gap-1 transform -translate-x-1/2'>
              {userCall.map((user, index) => {
                return (
                  <MyVideoCall
                    peer={peer}
                    user={user}
                    key={index}
                  ></MyVideoCall>
                )
              })}
            </div>
          </div>
          <div className={classes.container}>
            <Box className={classes.root} sx={{ width: "100%" }}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {listTableRoom?.map((table, index) => {
                  return table.numberOfSeat == 4 ? (
                    <Grid
                      item
                      xs={6}
                      key={index}
                      onClick={() => joinTable(table._id)}
                    >
                      <Item className={classes.table}>
                        <div>
                          <h5 className="mt-10">{table?.name}</h5>
                          {currentUser?.user?._id === ownerRoom?.owner?._id ? (
                            <IconButton
                              className={classes.btnDelete}
                              onClick={() => deleteTable(table._id)}
                            >
                              <DeleteIcon fontSize="large" />
                            </IconButton>
                          ) : (
                            ""
                          )}
                          <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                          >
                            {userCall.map((user, index) => {
                              <Grid item xs={6} key={index}>
                                <IconButton
                                  color="primary"
                                  className={classes.chair}>
                                  {joinTables ? (
                                    <Avatar
                                      name={user?.user?.name}
                                      size="50"
                                      round={true}>
                                    </Avatar>
                                  ) : (
                                    <ChairTwoToneIcon fontSize="large" />
                                  )}
                                </IconButton>
                              </Grid>;
                            })}
                          </Grid>
                        </div>
                      </Item>
                    </Grid>
                  ) : table.numberOfSeat === 3 ? (
                    <Grid
                      item
                      xs={6}
                      key={index}
                      onClick={() => joinTable(table._id)}
                    >
                      <Item className={classes.table}>
                        <div>
                          <h5 className="pb-12">{table?.name}</h5>
                          {currentUser.user?._id === ownerRoom?.owner?._id ? (
                            <IconButton
                              className={classes.btnDelete}
                              onClick={() => deleteTable(table._id)}
                            >
                              <DeleteIcon fontSize="large" />
                            </IconButton>
                          ) : ("")}
                          <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                          >
                            <Grid item xs={4}>
                              <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                                className={classes.chair}
                                onClick={() => joinTable(table._id)}
                              >
                                <ChairTwoToneIcon fontSize="large" />
                              </IconButton>
                            </Grid>
                            <Grid item xs={4}>
                              <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                                className={classes.chair}
                                onClick={() => joinTable(table._id)}
                              >
                                <ChairTwoToneIcon fontSize="large" />
                              </IconButton>
                            </Grid>
                            <Grid item xs={4}>
                              <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                                className={classes.chair}
                                onClick={() => joinTable(table._id)}
                              >
                                <ChairTwoToneIcon fontSize="large" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </div>
                      </Item>
                    </Grid>
                  ) : table.numberOfSeat === 2 ? (
                    <Grid
                      item
                      xs={6}
                      key={index}
                      onClick={() => joinTable(table._id)}
                    >
                      <Item className={classes.table}>
                        <div>
                          <h5 className="pb-12">{table?.name}</h5>
                          {currentUser?.user?._id === ownerRoom?.owner?._id ? (
                            <IconButton
                              className={classes.btnDelete}
                              onClick={() => deleteTable(table._id)}
                            >
                              <DeleteIcon fontSize="large" />
                            </IconButton>
                          ) : (
                            ""
                          )}
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
                                onClick={() => joinTable(table._id)}
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
                                onClick={() => joinTable(table._id)}
                              >
                                <ChairTwoToneIcon fontSize="large" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </div>
                      </Item>
                    </Grid>
                  ) : (
                    ""
                  );
                })}
              </Grid>
            </Box>
            <div className={classes.toolBar}>
              <ToolBar
                member={member}
                tableMessages={tableMessages}
                socketTable={socketTable}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomDetail;
