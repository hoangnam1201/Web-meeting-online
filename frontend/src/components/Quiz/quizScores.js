import { IconButton, Pagination, TablePagination } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useDispatch, useSelector } from 'react-redux';
import { submissionGetQuizDetail } from '../../store/actions/submissionAction';
import { getScoresAction } from '../../store/actions/scoreAction';

const QuizScores = () => {
  const { id } = useParams();
  const submissionState = useSelector(state => state.submissionReducer);
  const scoreState = useSelector(state => state.scoreReducer);
  const [pageState, setPageState] = useState({ page: 0, rowsPerPage: 10 });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(submissionGetQuizDetail(id));
    dispatch(getScoresAction(id))
  }, [id])

  const pageChage = (page) => {
    setPageState({ ...pageState, page })
    console.log(pageState)
    console.log(page)
    dispatch(getScoresAction(id, pageState.rowsPerPage, page))
  }

  const rowsPerPageChage = (rowsPerPage) => {
    setPageState({ ...pageState, rowsPerPage })
    dispatch(getScoresAction(id, rowsPerPage, pageState.page))
  }

  return (
    <div>
      <div className='flex gap-3 justify-start items-center bg-gray-50 shadow-sm p-2'>
        {submissionState?.quizDetail && (
          <Link to={'/user/update-event/' + submissionState?.quizDetail?.room}><ArrowBackIosIcon /></Link>
        )}
        <p className='text-xl tracking-wider'>{submissionState?.quizDetail?.name} scores</p>
      </div>
      <div className='md:mx-6 mt-4 shadow-md flex-col flex'>
        <div className='w-full'>
          <table className='w-full table-fixed '>
            <thead>
              <tr className='bg-gray-100'>
                <td className='py-2'>Start date</td>
                <td className='py-2'>User</td>
                <td className='py-2'>Number of correct answers</td>
                <td className='py-2'>Score</td>
              </tr>
            </thead>
            <tbody>
              {scoreState && scoreState.records?.map((s, index) => (
                <tr key={s._id}>
                  <td className='border-b py-1'>{new Date(s.startDate).toLocaleString()}</td>
                  <td className='border-b py-1 overflow-hidden text-ellipsis whitespace-nowrap'>
                    <span className='text-base mr-1'>{s?.user?.name}</span>
                    <span className='text-sm'>({s?.user?.email})</span>
                  </td>
                  <td className='border-b py-1'>{s?.countCorrect} / {s?.countQuestion}</td>
                  <td className='border-b py-1 overflow-hidden text-ellipsis whitespace-nowrap'>{s?.score}</td>
                </tr>
              ))}
              <tr>
                <TablePagination colSpan={4} page={pageState.page}
                  onPageChange={(e, page) => {
                    pageChage(page)
                  }}
                  onRowsPerPageChange={(e) => {
                    rowsPerPageChage(e.target.value)
                  }}
                  rowsPerPage={pageState.rowsPerPage} count={scoreState.countRecords} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default QuizScores