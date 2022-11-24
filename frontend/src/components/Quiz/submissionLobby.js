import { Button, Checkbox, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { submissionGetCurrentQuestion, submissionGetQuestions, submissionSubmitSubmissionAction } from '../../store/actions/submissionAction';
import { useParams } from 'react-router-dom';
import DoneIcon from '@mui/icons-material/Done';
import { confirmSwal } from '../../services/swalServier';

const SubmissionLobby = () => {
  const submissionState = useSelector(state => state.submissionReducer);
  const [timer, setTimer] = useState('');
  const [answer, setAnswer] = useState(null);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    let interval;
    dispatch(submissionGetQuestions(id))
    if (submissionState && submissionState.quizDetail) {
      const startDate = new Date(submissionState.currentSubmission.startDate).getTime();
      const nowDate = new Date().getTime();
      const temp = nowDate - startDate;
      interval = startTimer((submissionState.quizDetail.duration - (temp / 60000)) * 60)
    }
    return () => {
      interval && clearInterval(interval);
    }
  }, [submissionState?.currentSubmission?._id])

  useEffect(() => {
    if (submissionState?.currentQuestion) {
      setIndexQuestion(submissionState.questions.findIndex(q => q._id === submissionState.currentQuestion._id))
      const answerTemp = submissionState?.currentQuestion.submission.answer;
      if (answerTemp)
        setAnswer({ answers: answerTemp.answers, essay: answerTemp.essay })
      return;
    }
    setAnswer(null)
  }, [submissionState?.currentQuestion])

  const startTimer = (duration, display) => {
    var timer = duration, minutes, seconds;
    return setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      setTimer(minutes + ":" + seconds);
      if (--timer < 0) {
        dispatch(submissionSubmitSubmissionAction(answer))
      }
    }, 1000);
  }

  const radioChange = (e) => {
    const value = e.target.value;
    setAnswer({
      answers: [{
        'answerId': value,
        'content': ''
      }],
      "essay": ''
    })
  }

  const checkboxChange = (e) => {
    const answersTemp = answer?.answers || [];
    if (e.target.checked) {
      setAnswer({
        answers: [...answersTemp, {
          answerId: e.target.value,
          content: '',
        }],
        essay: ''
      })
    } else {
      const temp = answersTemp.filter(a => a.answerId !== e.target.value);
      setAnswer({
        answers: [...temp],
        essay: ''
      })
    }
  }

  const essayChange = (e) => {
    setAnswer({
      answers: [],
      essay: e.target.value
    })
  }

  const fillinChange = (value, answerId) => {
    const answersTemp = answer?.answers;
    if (answersTemp) {
      const temp = answersTemp.find(a => a.answerId === answerId);
      if (temp) {
        temp.content = value;
        setAnswer({ ...answer })
        return;
      }
      setAnswer({
        answers: [...answersTemp, {
          answerId,
          content: value
        }]
      })
      return;
    }
    setAnswer({
      answers: [{
        answerId,
        content: value
      }]
    })
  }

  const nextQuestion = () => {
    if (submissionState?.questions[indexQuestion + 1])
      dispatch(submissionGetCurrentQuestion(
        submissionState?.questions[indexQuestion + 1]._id,
        answer
      ))
  }

  const previousQuestion = () => {
    if (submissionState?.questions[indexQuestion - 1])
      dispatch(submissionGetCurrentQuestion(
        submissionState?.questions[indexQuestion - 1]._id,
        answer
      ))
  }

  return (
    <div className='grid grid-cols-4 gap-2 m-4 text-left'>
      <div className='col-span-4 px-2 flex justify-end'>
        <div className=' bg-blue-800 text-white p-1 font-semibold rounded-full w-36 text-center'>
          <QueryBuilderIcon /> - {timer}
        </div>
      </div>
      <div className='col-span-3 p-5 shadow-md'>
        {submissionState?.currentQuestion && (
          <div className='ml-5'>
            <div className='flex tracking-wide gap-4'>
              <p className='font-semibold min-w-max'>Question
                {' ' + (indexQuestion + 1)}:</p>
              <textarea className='w-full p-2' disabled value={submissionState.currentQuestion.content}></textarea>
            </div>
            <div className='ml-1'>
              {submissionState.currentQuestion.type === 'ONE' ? (<div>
                <FormLabel>Choose the correct answer:</FormLabel>
                <RadioGroup onChange={radioChange} value={answer?.answers[0].answerId || ''}>
                  {submissionState.currentQuestion.choices.map(c => (
                    <FormControlLabel key={c._id} value={c._id} control={<Radio />} label={c.content} />
                  ))}
                </RadioGroup>
              </div>) : submissionState.currentQuestion.type === 'MULTIPLE' ? (<div className='flex flex-col'>
                <FormLabel>Choose the correct answers:</FormLabel>
                {submissionState.currentQuestion.choices.map(c => (
                  <FormControlLabel key={c._id} value={c._id} onChange={checkboxChange} control={<Checkbox />} label={c.content} checked={!!answer?.answers.find(a => a.answerId === c._id)} />
                ))}
              </div>) : submissionState.currentQuestion.type === 'ESSAY' ? (<div className='flex flex-col'>
                <FormLabel>Write your essay below:</FormLabel>
                <textarea onChange={essayChange} value={answer?.essay || ''} className=' outline-none shadow-md border border-gray-100 p-4 text-gray-500' rows={15}></textarea>
              </div>) : submissionState.currentQuestion.type === 'FILLIN' ? (<div className='flex flex-col'>
                <FormLabel>Fill in your answer in box:</FormLabel>
                {submissionState.currentQuestion.choices.map(c => (
                  <TextField margin='dense' key={c._id} onChange={(e) => { fillinChange(e.target.value, c._id) }} value={answer?.answers.find(a => a.answerId === c._id)?.content || ''} type='text' />
                ))}
              </div>) : ''}
            </div>
            <div className='flex justify-between mt-4'>
              <Button variant='outlined' disabled={!submissionState?.questions[indexQuestion - 1]}
                onClick={previousQuestion}>previous</Button>
              {
                submissionState?.questions[indexQuestion + 1] ? (
                  <Button variant='outlined' disabled={!submissionState?.questions[indexQuestion + 1]}
                    onClick={nextQuestion}>next</Button>
                ) : (
                  <Button variant='outlined' className='mt-4'
                    onClick={() => {
                      confirmSwal('Submit submission', 'Are you sure?', () => {
                        dispatch(submissionSubmitSubmissionAction(answer))
                      })
                    }}>Submit</Button>
                )
              }
            </div>
          </div>
        )}
      </div>
      <div>
        <div className='p-2 shadow-md'>
          <p className='mb-3 text-sm'>Questions:</p>
          <div className='flex flex-wrap items-start justify-start gap-3 text-center'>
            {submissionState?.questions.map((q, index) => (
              <button key={q._id} className={`w-10 h-10 shadow rounded-lg relative hover:bg-gray-200 outline-none ${q._id === submissionState?.currentQuestion?._id ? 'bg-gray-300' : 'bg-gray-100 '}`}
                onClick={() => { dispatch(submissionGetCurrentQuestion(q._id, answer)) }}>{index + 1}
                {submissionState?.currentSubmission?.answers?.findIndex(a => a.questionId === q._id) !== -1 && <DoneIcon className='absolute top-0 left-1/2 bg-blue-500 opacity-50 rounded-tr-lg' />}
              </button>
            ))}
          </div>
          <Button variant='outlined' className='mt-4'
            onClick={() => {
              confirmSwal('Submit submission', 'Are you sure?', () => {
                dispatch(submissionSubmitSubmissionAction(answer))
              })
            }}>Submit</Button>
        </div>
      </div>
    </div >
  )
}

export default SubmissionLobby