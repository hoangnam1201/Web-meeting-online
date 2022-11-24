import React from "react";
import DoneIcon from '@mui/icons-material/Done';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "react-avatar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { roomCallResponceRequests } from "../../store/actions/roomCallAction";
import { Card, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Popover } from "@mui/material";
import DoneAllIcon from '@mui/icons-material/DoneAll';

const RequestList = ({ requests }) => {
  const roomCall = useSelector((state) => state.roomCall);
  const dispatch = useDispatch();
  const replyHandlerAll = () => {
    dispatch(roomCallResponceRequests(roomCall?.requests.map(r => r._id), true));
  }

  return (
    <List style={{ overflowY: 'auto', width: '300px' }}>
      <ListItem>
        <Card variant="outlined">
          <ListItemButton style={{ padding: '0 1rem' }} onClick={replyHandlerAll}>
            <ListItemIcon>
              <DoneAllIcon />
            </ListItemIcon>
            <ListItemText primary='Accept all requests' />
          </ListItemButton>
        </Card>
      </ListItem>
      {requests?.map((user, index) => (
        <RequestItem request={user} key={index} />
      ))}
    </List>
  );
};

const RequestItem = ({ request }) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const dispatch = useDispatch();

  const replyHandler = (isAccept) => {
    dispatch(roomCallResponceRequests([request._id], isAccept))
  };

  return (
    <ListItem
      secondaryAction={
        <div>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
          <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <ListItem disablePadding>
                <ListItemButton style={{ padding: '0 1rem' }}
                  onClick={() => replyHandler(true)}>
                  <ListItemIcon>
                    <DoneIcon />
                  </ListItemIcon>
                  <ListItemText primary='accept' />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton style={{ padding: '0 1rem' }}
                  onClick={() => replyHandler(false)}>
                  <ListItemIcon>
                    <DoNotDisturbIcon />
                  </ListItemIcon>
                  <ListItemText primary='refuse' />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>
        </div>
      }
    >
      <ListItemAvatar
      >
        {request?.picture ? (
          <img
            src={request.user?.picture}
            alt=""
            referrerPolicy="no-referrer"
            style={{"cursor": "pointer", "borderRadius": "100%", "width": "48px"}}
          />
        ) : (
          <Avatar
            name={request.user?.name}
            size="48"
            round={true}
            className="cursor-pointer"
          />
        )}
      </ListItemAvatar>
      <ListItemText primary={request.user?.name} secondary={request.user?.email}
        primaryTypographyProps={{ noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
      />
    </ListItem>
  );
};

export default React.memo(RequestList);
