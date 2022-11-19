import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import QuizLobby from './quizLobby';
import SubmissionLobby from './submissionLobby';

const Quiz = () => {
  const { id } = useParams();
  const submissionState = useSelector(state => state.submissionReducer);

  return (<div>
    <p className=' text-2xl font-mediumbold py-2 bg-gray-100 shadow'>{ submissionState?.quizDetail?.name }</p>
    {submissionState.currentSubmission && submissionState.currentSubmission.status === 'DOING' ? <SubmissionLobby /> : <QuizLobby />}
  </div>)
}

export default Quiz