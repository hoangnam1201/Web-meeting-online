import { Dialog, Avatar, DialogContent, DialogTitle, Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import ReactAvatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux'
import { getInfoByIdAPI } from '../../../api/user.api';
import { toastError } from '../../../services/toastService';
import { roomCallSetSeletedUserInfo } from '../../../store/actions/roomCallAction';

const UserInfoDialog = () => {
  const roomCall = useSelector(state => state.roomCall);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roomCall?.seletedUserInfo)
      getUser(roomCall?.seletedUserInfo)
  }, [roomCall?.seletedUserInfo])

  const getUser = async (id) => {
    setLoading(true)
    try {
      const res = await getInfoByIdAPI(id);
      setLoading(false)
      if (!res.data) {
        toastError('not found user');
        setUser(null);
        return;
      }
      setUser(res.data);
    } catch (e) {
      toastError(e?.response?.data?.msg)
    }
  }

  return (
    <Dialog open={!!roomCall?.seletedUserInfo} onClose={() => {
      dispatch(roomCallSetSeletedUserInfo(null))
    }}>
      <DialogTitle>
        User Information
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        )
          : <div style={{ display: 'flex', gap: '8px' }}>
            {user?.picture ? (
              <Avatar src={user.picture} sx={{ width: 60, height: 60 }} />
            ) : <ReactAvatar
              name={user?.name}
              size={50}
              round
            />}
            <div>
              <Box>
                <h6 style={{ fontWeight: 600 }}>
                  Email:
                </h6>
                <p style={{ marginLeft: '8px' }}>
                  {user?.email}
                </p>
                <h6 style={{ fontWeight: 600 }}>
                  Name:
                </h6>
                <p style={{ marginLeft: '8px' }}>
                  {user?.name}
                </p>
                <h6 style={{ fontWeight: 600 }}>
                  Phone Number:
                </h6>
                <p style={{ marginLeft: '8px' }}>
                  {user?.phone}
                </p>
                <h6 style={{ fontWeight: 600 }}>
                  Role:
                </h6>
                <p style={{ marginLeft: '8px' }}>
                  {user?.role}
                </p>
              </Box>
            </div>
          </div>}
      </DialogContent>
    </Dialog >
  )
}

export default UserInfoDialog