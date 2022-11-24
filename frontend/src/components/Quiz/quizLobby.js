import { Button } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getMyCoresAPI } from '../../api/submission.api';
import { submissionCreateSubmissions, submissionGetCurrentSubmission, submissionGetQuizDetail, submissionGetSubmissions } from '../../store/actions/submissionAction';

const QuizLobby = () => {
  const { id } = useParams();
  const submissionState = useSelector(state => state.submissionReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(submissionGetQuizDetail(id));
    dispatch(submissionGetSubmissions(id));
  }, [id])

  const checkStart = () => {
    const dateNow = new Date().getTime();
    if (!submissionState.quizDetail) return false
    if (dateNow < submissionState.quizDetail.startDate || dateNow > submissionState.quizDetail.endDate) {
      return false
    }
    return true;
  }
  const startQuiz = () => {
    dispatch(submissionCreateSubmissions(id));
  }

  return (
    <div>
      <div className=' flex items-center justify-start flex-col gap-4'>
        <div className='p-4 shadow-md mt-5'>
          {submissionState && submissionState.quizDetail && (
            <div className=' text-gray-400 font-thin text-left'>
              <div>
                <span className='mr-2 text-gray-700 font-medium'>Quiz name:</span>
                <span>{submissionState.quizDetail.name}</span>
              </div>
              <div>
                <span className='mr-2 text-gray-700 font-medium'>Start time:</span>
                <span>{`${new Date(submissionState.quizDetail.startDate).toLocaleString()}`}</span>
              </div>
              <div>
                <span className='mr-2 text-gray-700 font-medium'>End time:</span>
                <span>{`${new Date(submissionState.quizDetail.endDate).toLocaleString()}`}</span>
              </div>
              <div>
                <span className='mr-2 text-gray-700 font-medium'>Duration:</span>
                <span>{`${submissionState.quizDetail.duration} minutes`}</span>
              </div>
              <div>
                <span className='mr-2 text-gray-700 font-medium'>Max number of Submissions:</span>
                <span>{`${submissionState.quizDetail.countSubmission}`}</span>
              </div>
              <div className='flex justify-center'>
                {<Button variant='outlined' disabled={!checkStart()} onClick={startQuiz}>
                  Start Quiz
                </Button>}
              </div>
            </div>
          )}
        </div>
        <div className='w-full md:px-16'>
          <div className='p-4 shadow-md'>
            <p className='text-left text-md'>Submissions</p>
            <table className='w-full table-fixed'>
              <thead>
                <tr className='bg-gray-50'>
                  <td className='py-2 w-10'></td>
                  <td className='py-2'>Start date</td>
                  <td className='py-2'>Status</td>
                  <td className='py-2'>Number of correct answers</td>
                  <td className='py-2'>Score</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {submissionState && submissionState.submissions?.map((s, index) => (
                  <tr key={s._id}>
                    <td className='border-b border-r'>{index + 1}</td>
                    <td className='border-b'>{new Date(s.startDate).toLocaleString()}</td>
                    <td className='border-b'>{
                      s.status === 'DOING' ?
                        (<p className='py-1 px-3 rounded-full text-white bg-green-500 inline-block'>doing</p>)
                        : (<p className='py-1 px-3 rounded-full text-white bg-blue-500 inline-block'>submitted</p>)}
                    </td>
                    <td className='border-b'>{s?.countCorrect} / {s?.countQuestion}</td>
                    <td className='border-b'>{s?.score}</td>
                    <td className='border-b'>
                      {s.status === 'DOING' && <Button onClick={() => dispatch(submissionGetCurrentSubmission(s._id))}>continute</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  )
}

export default QuizLobby