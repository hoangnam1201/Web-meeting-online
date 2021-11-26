import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import ContentChat from "../ContentChat";
import ToolBar from "../RoomDetail/toolbar";

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
    background: "#444444",
    color: "white",
  },
  boxScreen: {
    display: "flex",
    flexDirection: "column",
    width: "1000px",
    height: "600px",
    border: "1px solid black",
  },
  boxchat: {
    width: "400px",
    border: "1px solid white",
    background: "#666666",
    color: "white",
  },
  screen: {
    height: "500px",
    border: "1px solid white",
    width: "100%",
  },
  tools: {
    border: "1px solid white",
    height: "100px",
  },
});
const Presentation = () => {
  const classes = useStyles();
  const [member, setMember] = useState([]);
  const [socketTable, setSocketTable] = useState(null);
  const [tableMessages, setTableMessages] = useState([]);
  return (
    <div className={classes.root}>
      <div className={classes.boxScreen}>
        <div className={classes.screen}>Màn hình</div>
        <div className={classes.tools}>
          Tool Bar
          {/* <ToolBar
            member={member}
            socketTable={socketTable}
            tableMessage={tableMessages}
          /> */}
        </div>
      </div>
      <div className={classes.boxchat}>
        <ContentChat />
      </div>
    </div>
  );
};
export default Presentation;
