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
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SettingsIcon from "@mui/icons-material/Settings";
import Swal from "sweetalert2";

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
    defaultValues: { startDate: new Date().getTime() },
  });

  useEffect(() => {
    dispatch(getQuizAction(roomId));
  }, [roomId]);

  useEffect(() => {
    if (quiz && quiz.selectedQuiz.length > 0) {
      const quizData = quiz.data.find((x) => x._id === quiz.selectedQuiz[0]);
      reset({
        name: quizData?.name,
        description: quizData?.description,
        startDate: quizData?.startDate,
        duration: quizData?.duration,
      });
    } else {
      reset({
        name: "",
        description: "",
        duration: "",
        startDate: new Date().getTime(),
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
          startDate: new Date().getTime(),
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
            startDate: new Date().getTime(),
          });
        })
      );
    }
  };

  const handleDateChange = (date) => {
    setValue("startDate", date.getTime(), { shouldValidate: true });
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
                    className={`group rounded-md mt-4 ${
                      quiz.selectedQuiz.indexOf(q._id) !== -1
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
                disabled={quiz?.selectedQuiz.length > 1}
                InputLabelProps={{ shrink: true }}
                label="Name of quiz"
                name="name"
                {...register("name", {
                  required: quiz?.selectedQuiz.length > 1 ? null : "Required",
                  minLength:
                    quiz?.selectedQuiz.length > 1
                      ? null
                      : { value: 5, message: "Min length is 5" },
                })}
                error={!!errors?.name}
                helperText={errors?.name?.message}
              />
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                disabled={quiz?.selectedQuiz.length > 1}
                InputLabelProps={{ shrink: true }}
                label="Description"
                name="description"
                {...register("description", {
                  required: quiz?.selectedQuiz.length > 1 ? null : "Required",
                  minLength:
                    quiz?.selectedQuiz.length > 1
                      ? null
                      : { value: 5, message: "Min length is 5" },
                })}
                error={!!errors?.description}
                helperText={errors?.description?.message}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  variant="outlined"
                  margin="dense"
                  disabled={quiz?.selectedQuiz.length > 1}
                  InputLabelProps={{ shrink: true }}
                  id="date-picker-dialog-register"
                  label="Start Date"
                  inputFormat="MM/dd/yyyy"
                  value={new Date(getValues("startDate"))}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField className="my-2" fullWidth {...params} />
                  )}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  disabled={quiz?.selectedQuiz.length > 1}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { min: 15, max: 120 } }}
                  margin="dense"
                  label="Duration"
                  {...register("duration", {
                    required: quiz?.selectedQuiz.length > 1 ? null : "Required",
                    max:
                      quiz?.selectedQuiz.length > 1
                        ? null
                        : { value: 120, message: "Max duraion is 120 minutes" },
                    min:
                      quiz?.selectedQuiz.length > 1
                        ? null
                        : { value: 15, message: "Min duraion is 15 minutes" },
                  })}
                  error={!!errors?.duration}
                  helperText={errors?.duration?.message}
                />
              </LocalizationProvider>
              {quiz?.selectedQuiz?.length === 0 ? (
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
