import { Badge, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { kickComfirmSwal, SendBuzzSwal } from "../../../services/swalServier";
import BlockIcon from '@mui/icons-material/Block';
import TelegramIcon from '@mui/icons-material/Telegram';
import InfoIcon from '@mui/icons-material/Info';
import { roomCallSetSeletedUserInfo } from "../../../store/actions/roomCallAction";

const SeatAvatar = React.memo(({ user, ...rest }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const roomCallState = useSelector((state) => state.roomCall);
  const userSate = useSelector((state) => state.userReducer);
  const dispatch = useDispatch()

  useEffect(() => {
    setAnchorEl(null);
  }, [user]);

  const clickHandler = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const KickHandler = (e, id) => {
    e.stopPropagation();
    kickComfirmSwal((value) => {
      roomCallState?.socket.emit("room:kick", id, !!value);
    });
    setAnchorEl(null)
  };

  const BuzzHandler = (e, id) => {
    e.stopPropagation();
    SendBuzzSwal((value) => {
      roomCallState?.socket.emit("room:buzz", id, value);
    });
    setAnchorEl(null)
  };

  return (
    <div className="absolute flex items-center" {...rest}>
      {user && (
        <div>
          <Badge badgeContent={
            user?._id === userSate?.user?._id ? 'you' :
              user?._id === roomCallState?.roomInfo?.owner?._id ? 'host' :
                0} color={
                  user?._id === userSate?.user?._id ?
                    'secondary' : 'primary'
                }>
            {user?.picture ? (
              <div>
                <button onClick={clickHandler} className="outline-none">
                  <img
                    className="rounded-full shadow-lg"
                    src={user?.picture}
                    alt=""
                    width={50}
                    referrerPolicy="no-referrer"
                    height={50}
                  />
                </button>
              </div>
            ) : (
              <div>
                <button onClick={clickHandler} className="outline-none">
                  <Avatar
                    onClick={() => { }}
                    name={user?.name}
                    size="50"
                    round={true}
                    className="shadow-md"
                  />
                </button>
              </div>
            )}
          </Badge>
          <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
            disableEnforceFocus
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

              {roomCallState?.roomInfo?.owner._id === userSate?.user._id &&
                userSate?.user._id !== user._id && (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton style={{ padding: '0 1rem' }}
                        onClick={(e) => KickHandler(e, user?._id)}
                      >
                        <ListItemIcon>
                          <BlockIcon />
                        </ListItemIcon>
                        <ListItemText primary='Kick' />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton style={{ padding: '0 1rem' }}
                        onClick={(e) => BuzzHandler(e, user?._id)}
                      >
                        <ListItemIcon>
                          <TelegramIcon />
                        </ListItemIcon>
                        <ListItemText primary='Buzz' />
                      </ListItemButton>
                    </ListItem >
                  </>
                )}
              <ListItem disablePadding>
                <ListItemButton style={{ padding: '0 1rem' }}
                  onClick={() => {
                    dispatch(roomCallSetSeletedUserInfo(user?._id))
                    setAnchorEl(null)
                  }}>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary='Info' />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>
        </div>
      )}
    </div >
  );
});

export default SeatAvatar;
