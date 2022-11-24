import React, { useEffect } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import {
  addQuizAction,
  deleteQuizAction,
  getQuizAction,
  selectQuizAction,
  updateQuizActon,
} from "../../store/actions/quizAction";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SettingsIcon from "@mui/icons-material/Settings";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Swal from "sweetalert2";
import { DesktopDateTimePicker } from "@mui/x-date-pickers";

const QuizManage = (props) => {
  const { roomId } = props;
  const quiz = useSelector((state) => state.quizReducer);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      startDate: new Date().getTime(),
      endDate: new Date().getTime()
    },
  });

  useEffect(() => {
    dispatch(getQuizAction(roomId));
  }, [roomId]);

  useEffect(() => {
    if (quiz && quiz.selectedQuiz) {
      const quizData = quiz.data.find((x) => x._id === quiz.selectedQuiz);
      reset({
        name: quizData?.name,
        description: quizData?.description,
        startDate: quizData?.startDate,
        endDate: quizData?.endDate,
        duration: quizData?.duration,
        countSubmission: quizData?.countSubmission,
      });
    } else {
      reset({
        name: "",
        description: "",
        duration: "",
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
      });
    }
  }, [quiz?.selectedQuiz]);

  const createQuiz = (data) => {
    const quiz = { ...data, room: roomId };
    dispatch(
      addQuizAction(quiz, roomId, () => {
        reset({
          name: "",
          description: "",
          duration: "",
          countSubmission: 1,
          startDate: new Date().getTime(),
          endDate: new Date().getTime()
        });
      })
    );
  };

  const updateQuiz = (data) => {
    const quizData = { ...data, room: roomId };
    if (quiz.selectedQuiz) {
      dispatch(
        updateQuizActon(quiz?.selectedQuiz, quizData, () => {
          reset({
            name: "",
            description: "",
            duration: "",
            countSubmission: 1,
            startDate: new Date().getTime(),
            endDate: new Date().getTime()
          });
        })
      );
    }
  };

  const handleDateChange = (date, key) => {
    setValue(key, date.getTime(), { shouldValidate: true });
  };

  const selectedQuiz = (id) => {
    dispatch(selectQuizAction(id));
  };

  const deleteQuiz = (e, quizId) => {
    e.stopPropagation();
    Swal.fire({
      icon: "question",
      title: "Remove quiz",
      text: "confirm",
      showCancelButton: true,
      confirmButtonText: "confirm",
      cancelButtonText: "cancel",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) dispatch(deleteQuizAction(quizId, roomId));
    });
  };

  return (
    <div>
      <div className="shadow-md p-4 mt-4">
        <div className="py-4 text-left">
          <p className="text-md font-semibold">Quiz attempt</p>
          <p className="text-gray-400 font-thin text-sm">
            The tables management quiz attempt
          </p>
        </div>
        <div className="grid grid-cols-3">
          <div
            className="flex flex-col col-span-2"
            style={{ height: "5 00px" }}
          >
            <div className="grid grid-cols-2 px-4 py-2 bg-gray-200 rounded-md">
              <div className="text-left border-r-2 border-gray-500">
                Name of quiz
              </div>
              <div className="text-left pl-3">Duration</div>
            </div>
            <div className="flex-grow h-0 overflow-y-auto scroll-sm">
              {quiz?.data?.map((q) => {
                return (
                  <div
                    onClick={() => selectedQuiz(q._id)}
                    className={`group rounded-md mt-4 ${quiz.selectedQuiz === q._id
                      ? "border-2 border-gray-500"
                      : ""
                      } `}
                    key={q._id}
                  >
                    <div className="grid grid-cols-2 px-4 py-2 bg-gray-100 rounded-md text-sm text-gray-500 group-hover:bg-slate-300">
                      <div className="text-left border-r-2 border-gray-300">
                        {q.name}
                      </div>
                      <div className="text-left pl-3 flex justify-between">
                        {q.duration} minutes
                        <div>
                          <Link
                            to={`/user/quiz-scores/${q._id}`}
                            target="_blank"
                            className="mr-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AppRegistrationIcon fontSize="small" />
                          </Link>
                          <Link
                            to={`/user/management-quiz/${q._id}`}
                            target="_blank"
                            className="mr-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SettingsIcon fontSize="small" />
                          </Link>
                          <button onClick={(e) => deleteQuiz(e, q._id)}>
                            <RemoveIcon fontSize="small" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-4">
            <div className="text-left text-md text-gray-500 font-semibold">
              Create quiz
            </div>
            <form className="flex flex-col gap-4">
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                InputLabelProps={{ shrink: true }}
                label="Name of quiz"
                name="name"
                {...register("name", { required: 'required' })}
                error={!!errors?.name}
                helperText={errors?.name?.message}
              />
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                InputLabelProps={{ shrink: true }}
                label="Description"
                name="description"
                {...register("description", {
                  required: 'required',
                  minLength: { value: 5, message: "Min length is 5" },
                })}
                error={!!errors?.description}
                helperText={errors?.description?.message}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDateTimePicker
                  variant="outlined"
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  id="date-picker-dialog-register"
                  label="Start Date"
                  value={new Date(getValues("startDate"))}
                  onChange={(e) => handleDateChange(e, 'startDate')}
                  renderInput={(params) => (
                    <TextField className="my-2" fullWidth {...params} />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDateTimePicker
                  variant="outlined"
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  id="date-picker-dialog-register"
                  label="End Date"
                  value={new Date(getValues("endDate"))}
                  onChange={(e) => handleDateChange(e, 'endDate')}
                  renderInput={(params) => (
                    <TextField className="my-2" fullWidth {...params} />
                  )}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                variant="outlined"
                InputProps={{ inputProps: { min: 1 } }}
                margin="dense"
                type='number'
                label="number of Submissions of a user"
                {...register("countSubmission", {
                  required: true, min:
                    { value: 1, message: 'min number of submission is 1' }
                })}
                InputLabelProps={{ shrink: true }}
                error={!!errors?.countSubmission}
                helperText={errors?.countSubmission?.message}
              />
              <TextField
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ inputProps: { min: 15, max: 120 } }}
                margin="dense"
                type='number'
                label="Duration (Minutes)"
                {...register("duration", {
                  required: "required",
                  max: { value: 120, message: "Max duraion is 120 minutes" },
                  min: { value: 5, message: "Min duraion is 5 minutes" },
                })}
                error={!!errors?.duration}
                helperText={errors?.duration?.message}
              />
              {!quiz?.selectedQuiz ? (
                <LoadingButton
                  onClick={handleSubmit(createQuiz)}
                  variant="contained"
                  loading={quiz.loading}
                >
                  Add
                </LoadingButton>
              ) : (
                <LoadingButton
                  onClick={handleSubmit(updateQuiz)}
                  variant="contained"
                  loading={quiz.loading}
                >
                  Update
                </LoadingButton>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizManage;
