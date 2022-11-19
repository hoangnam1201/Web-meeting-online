import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getQuizAction } from '../../../store/actions/quizAction';
import { roomShowQuizsAction } from '../../../store/actions/roomCallAction';
import QuizIcon from '@mui/icons-material/Quiz';

const ListQuiz = () => {
  const roomCall = useSelector(state => state.roomCall);
  const quizState = useSelector(state => state.quizReducer)
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getQuizAction(id))
  }, [id])

  return (
    <React.Fragment>
      <Drawer open={roomCall?.showQuizs} onClose={() => {
        dispatch(roomShowQuizsAction(false))
      }}>
        <Typography variant='h6' textAlign='center' style={{
          backgroundColor: '#f3f4f6',
          padding: '4px'
        }}>Quiz List</Typography>
        <List style={{ overflowY: 'auto', width: '300px' }}>
          {quizState && quizState.data.map(q => (
            <ListItemButton key={q._id} onClick={() => {
              window.open(`/quiz/${q._id}`)
            }}>
              <ListItemIcon>
                <QuizIcon />
              </ListItemIcon>
              <ListItemText primary={q.name} secondary={
                <React.Fragment>
                  <Typography component='span' variant='body2' style={{ display: 'block' }}>
                    <Typography component='span' variant='body2' color='text.primary'>
                      Start
                    </Typography>
                    <Typography component='span' variant='body2'>
                      {': ' + new Date(q.startDate).toLocaleString()}
                    </Typography>
                  </Typography>
                  <Typography component='span' variant='body2' style={{ display: 'block' }}>
                    <Typography component='span' variant='body2' color='text.primary'>
                      End
                    </Typography>
                    <Typography component='span' variant='body2'>
                      {': ' + new Date(q.endDate).toLocaleString()}
                    </Typography>
                  </Typography>
                  <Typography component='span' variant='body2' style={{ display: 'block' }}>
                    <Typography component='span' variant='body2' color='text.primary'>
                      Duration
                    </Typography>
                    <Typography component='span' variant='body2'>
                      {`: ${q.duration} minutes`}
                    </Typography>
                  </Typography>
                </React.Fragment>
              } />
            </ListItemButton>
          ))
          }
        </List>
      </Drawer>
    </React.Fragment >
  )
}

export default ListQuiz