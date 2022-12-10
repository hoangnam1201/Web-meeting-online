import { Button, IconButton, Pagination, TablePagination } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useDispatch, useSelector } from 'react-redux';
import { submissionGetQuizDetail } from '../../store/actions/submissionAction';
import { getScoresAction } from '../../store/actions/scoreAction';
import { downloadSubmissionAPI, downloadSubmissionInQuizAPI } from '../../api/submission.api';

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

  const downloadAll = async () => {
    const res = await downloadSubmissionInQuizAPI(id)
    const url = window.URL.createObjectURL(
      new Blob([res], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `quiz${id}.xlsx`,
    );
    // Append to html link element page
    document.body.appendChild(link);
    // Start download
    link.click();
    // Clean up and remove the link
    link.parentNode.removeChild(link);
  }

  const download = async (submissionId, startDate) => {
    const res = await downloadSubmissionAPI(submissionId)
    const url = window.URL.createObjectURL(
      new Blob([res], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `submission-${submissionId}-${startDate}.xlsx`,
    );
    // Append to html link element page
    document.body.appendChild(link);
    // Start download
    link.click();
    // Clean up and remove the link
    link.parentNode.removeChild(link);
  }

  return (
    <div>
      <div className='flex gap-3 justify-start items-center bg-gray-50 shadow-sm p-2'>
        {submissionState?.quizDetail && (
          <Link to={'/user/update-event/' + submissionState?.quizDetail?.room}><ArrowBackIosIcon /></Link>
        )}
        <p className='text-xl tracking-wider'>{submissionState?.quizDetail?.name} scores</p>
      </div>

      <div className='md:mx-6 m-4 shadow-md flex-col flex'>
        <div className='w-full'>
          <table className='w-full table-fixed '>
            <thead>
              <tr className='bg-gray-100'>
                <td className='py-2'>Start date</td>
                <td className='py-2'>User</td>
                <td className='py-2'>Number of correct answers</td>
                <td className='py-2'>Score</td>
                <td className='py-2'>
                  {id &&
                    <Button onClick={downloadAll}>Download All</Button>
                  }
                </td>
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
                  <td className='border-b py-1 overflow-hidden text-ellipsis whitespace-nowrap'>
                    <Button onClick={() => download(s._id, s.startDate)}>download</Button>
                  </td>
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