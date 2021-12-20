import React, { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { IconButton } from "@material-ui/core";
import Avatar from "react-avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const useStyles = makeStyles({
  root: {
    width: "300px",
    height: "500px",
    position: "absolute",
    background: "white",
    boxShadow: "0px 5px 10px gray",
    borderRadius: "10px",
    top: "-500px",
    right: "5px",
    transition: "all .5s ease",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "solid 1px black",
    height: "30px",
  },
  contain: {
    height: "470px",
    scrollBehavior: "smooth",
    overflowY: "scroll",
  },
  user: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px",
    height: "60px",
    "&:hover": {
      background: "grey",
      color: "white",
    },
  },
});

const LobbyUser = (props) => {
  const { openLobby, userJoined } = props;
  const classes = useStyles();

  return (
    <>
      {openLobby ? (
        <div className={classes.root}>
          <div className={classes.title}>
            <h4>Users in room</h4>
          </div>
          <div className={classes.contain}>
            {userJoined?.map((user, index) => {
              return (
                <div className={classes.user} key={index}>
                  <Avatar
                    name={user?.name}
                    size="40"
                    round={true}
                    className="cursor-pointer"
                  />
                  <h5>{user?.name}</h5>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default LobbyUser;
