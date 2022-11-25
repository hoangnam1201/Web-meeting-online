import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "react-avatar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { kickComfirmSwal, SendBuzzSwal } from "../../services/swalServier";
import {
  ListItemText,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton, Popover, ListItemIcon, IconButton, Card
} from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import TelegramIcon from '@mui/icons-material/Telegram';
import InfoIcon from '@mui/icons-material/Info';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { downloadJoinersAPI } from "../../api/room.api";
import { useParams } from "react-router-dom";
import { toastError } from "../../services/toastService";

const JoinerList = ({ joiners }) => {
  const { id } = useParams();
  const dowload = async () => {
    try {
      const res = await downloadJoinersAPI(id);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(
        new Blob([blob])
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${id}.xlsx`,
      );
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (e) {
      console.log(e)
      toastError('Error to download');
    }
  }

  return (
    <List style={{ overflowY: 'auto', width: '300px' }}>
      <ListItem>
        <Card variant="outlined">
          <ListItemButton style={{ padding: '0 1rem' }} onClick={dowload}>
            <ListItemIcon>
              <DownloadForOfflineIcon />
            </ListItemIcon>
            <ListItemText primary='Download joiner list' />
          </ListItemButton>
        </Card>
      </ListItem>
      {joiners?.map((user, index) => (
        <JoinerItem joiner={user} key={index} />
      ))}
    </List>
  );
};

const JoinerItem = ({ joiner }) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const roomCallState = useSelector((state) => state.roomCall);
  const userSate = useSelector((state) => state.userReducer);

  const KickHandler = (id) => {
    kickComfirmSwal((value) => {
      roomCallState?.socket.emit("room:kick", id, !!value);
    });
  };

  const BuzzHandler = (id) => {
    setAnchorEl(null);
    SendBuzzSwal((value) => {
      roomCallState?.socket.emit("room:buzz", id, value);
    });
  };
  return (
    <>
      <ListItem secondaryAction={
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

              {roomCallState?.roomInfo?.owner._id === userSate?.user._id &&
                userSate?.user._id !== joiner._id && (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton style={{ padding: '0 1rem' }}
                        onClick={() => KickHandler(joiner?._id)}
                      >
                        <ListItemIcon>
                          <BlockIcon />
                        </ListItemIcon>
                        <ListItemText primary='Kick' />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton style={{ padding: '0 1rem' }}
                        onClick={() => BuzzHandler(joiner?._id)}
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
                <ListItemButton style={{ padding: '0 1rem' }}>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary='Info' />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>
        </div>
      }>
        <ListItemAvatar>
          <Badge badgeContent={
            joiner?._id === roomCallState?.roomInfo?.owner?._id ?
              'host' : joiner?._id === userSate?.user?._id ?
                'you' : 0} color={
                  joiner?._id === roomCallState?.roomInfo?.owner?._id ?
                    'secondary' : 'primary'
                }>
            {joiner?.picture ? (
              <img
                src={joiner?.picture}
                alt=""
                referrerPolicy="no-referrer"
                style={{ "cursor": "pointer", "borderRadius": "100%", "width": "48px" }}
              />
            ) : (
              <Avatar
                name={joiner?.name}
                size="48"
                round={true}
                className="cursor-pointer"
              />
            )}
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={joiner?.name}
          secondary={joiner?.email}
          primaryTypographyProps={{ noWrap: true }}
          secondaryTypographyProps={{ noWrap: true }}
        />
      </ListItem>
    </>
  );
};

export default React.memo(JoinerList);
