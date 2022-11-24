import { IconButton } from '@mui/material';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useDispatch, useSelector } from 'react-redux';
import { submissionGetQuizDetail } from '../../store/actions/submissionAction';

const QuizScores = () => {
  const { id } = useParams();
  const submissionState = useSelector(state => state.submissionReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(submissionGetQuizDetail(id));
  }, [id])

  return (
    <div>
      <div className='flex gap-3 justify-start items-center bg-gray-50 shadow-sm p-2'>
        <IconButton><ArrowBackIosIcon /></IconButton>
        <p className='text-xl tracking-wider'>{submissionState?.quizDetail?.name} scores</p>
      </div>
    </div>
  )
}

export default QuizScores