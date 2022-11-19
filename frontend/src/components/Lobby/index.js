import React, { useState } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useDispatch, useSelector } from "react-redux";
import JoinerList from "./joinerList";
import RequestList from "./requestList";
import { roomCallResponceRequests, roomShowLobbyAction } from "../../store/actions/roomCallAction";
import { Drawer, Typography } from "@mui/material";

const LobbyUser = (props) => {
  const { openLobby, userJoined } = props;
  const currentUser = useSelector((state) => state.userReducer);
  const roomCall = useSelector((state) => state.roomCall);
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);

  return (
    <>
      <React.Fragment>
        <Drawer open={openLobby}
          disableEnforceFocus
          onClose={
            () => {
              dispatch(roomShowLobbyAction(false))
            }}
        >
          {roomCall?.roomInfo?.owner?._id === currentUser?.user?._id ? (
            <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)}>
              <Tab label="users" />
              <Tab label="request" />
            </Tabs>
          ) : (
            <Typography variant='h6' textAlign='center' style={{
              backgroundColor: '#f3f4f6',
              padding: '4px'
            }}>Joiners</Typography>
          )}
          {tab === 0 ? (
            <JoinerList joiners={userJoined} />
          ) : (
            <RequestList requests={roomCall?.requests} />
          )}
        </Drawer>
      </React.Fragment>
    </>
  );
};

export default React.memo(LobbyUser);
