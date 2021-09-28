import React from "react";
import MicIcon from "@mui/icons-material/Mic";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import { IconButton } from "@mui/material";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    background: "white",
    height: "75px",
    width: "500px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid black",
    padding: "10px 10px",
  },
});
const ToolBar = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <IconButton>
        <MicIcon fontSize="large" />
      </IconButton>
      <IconButton>
        <PhotoCameraFrontIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default ToolBar;
