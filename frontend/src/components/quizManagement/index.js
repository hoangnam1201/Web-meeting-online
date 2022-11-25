import * as React from "react";
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useFieldArray, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestionAction,
  deleteQuestionAction,
  getQuestionAction,
  selectQuestionAction,
  updateQuestionActon,
} from "../../store/actions/questionAction";
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getQuizByQuizIdAction } from "../../store/actions/quizAction";
import Swal from "sweetalert2";
import { confirmSwal, textSwal } from "../../services/swalServier";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function QuizManagement() {
  const question = useSelector((state) => state.questionReducer);
  const quiz = useSelector((state) => state.quizReducer);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue
  } = useForm({
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray(
    {
      control,
      name: "choices",
    }
  );
  const typeField = watch('type');
  const choicesField = watch('choices')


  useEffect(() => {
    dispatch(getQuestionAction(id));
    dispatch(getQuizByQuizIdAction(id));
  }, [id]);

  useEffect(() => {
    if (typeField === 'ESSAY') {
      return setValue('choices', [])
    }
  }, [typeField])

  useEffect(() => {
    if (question && question.selectedQuestion) {
      const data = question.data.find(
        (q) => q._id === question.selectedQuestion
      )
      let type = data.type;
      if (data.type === 'ONE' || data.type === 'MULTIPLE') {
        type = 'CHOICE';
      }
      reset({
        content: data.content,
        type: type,
        quiz: data.quiz,
        choices: data.choices.map((c) => {
          return {
            _id: c._id,
            isTrue: c.isTrue,
            content: c.content,
          };
        }),
      });
      return;
    }

    reset({ content: "", choices: [], type: 'CHOICE' });
  }, [question?.selectedQuestion]);

  const addChoice = () => {
    append({ content: "", isTrue: false });
  };

  const saveQuestion = (data) => {
    if (data.type === 'ESSAY') data.choices = []
    if (data.type === 'CHOICE') {
      const countTrue = data.choices.filter(t => t.isTrue === true);
      if (countTrue.length > 1) {
        data.type = 'MULTIPLE'
      } else {
        data.type = 'ONE'
      }
    }
    if (data.type === 'FILLIN') {
      data.choices = data.choices?.map(c => ({ ...c, isTrue: true }))
    }
    if (!question.selectedQuestion) {
      dispatch(
        addQuestionAction({ ...data, quiz: id }, id, () => {
          reset();
        })
      );
      return;
    }
    dispatch(updateQuestionActon(question.selectedQuestion, data));
  };

  const deleteAnswer = () => {
    Swal.fire({
      icon: "question",
      title: "Remove answer",
      text: "confirm",
      showCancelButton: true,
      confirmButtonText: "confirm",
      cancelButtonText: "cancel",
    }).then(({ isConfirmed }) => {
      if (isConfirmed)
        dispatch(deleteQuestionAction(question?.selectedQuestion, id));
    });
  }
  return (
    <>
      <div className=" flex items-center p-3 shadow">
        {quiz?.current && (<IconButton onClick={() => {
          history.push('/user/update-event/' + quiz?.current?.room)
        }}>
          <ArrowBackIosIcon />
        </IconButton>
        )}
        <div className="flex justify-center">
          <h3 className="text-black font-bold text-2xl">{quiz?.current?.name}</h3>
        </div>
      </div>
      <Box className="p-5" sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Item className="bg-gray-50">
              <div className="text-left p-5">
                <div className="flex justify-between">
                  <h3 className="font-bold mb-4 text-xl">
                    {question?.selectedQuestion
                      ? `Question ${question?.data?.findIndex(
                        (q) => q._id === question.selectedQuestion
                      ) + 1
                      } of ${question.data.length}`
                      : "New question"}
                  </h3>
                  <div className="flex gap-3 items-center">
                    {question?.selectedQuestion && <Button
                      onClick={() => dispatch(selectQuestionAction(null))}
                      variant="outlined"
                      color="primary"
                    >
                      Cancel
                    </Button>}
                    <Button
                      onClick={handleSubmit(saveQuestion)}
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-top block text">
                    <p>Question:</p>
                    <textarea
                      rows="5"
                      id="question"
                      className="ml-1 w-3/4 shadow p-4 outline-none rounded"
                      {...register("content", {
                        required: true,
                      })}
                    />
                  </label>
                  {errors?.content && errors?.content?.type === "required" && (
                    <div className="text-red-500 ml-20 pt-1">
                      Please input question !
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-bold text-top block text">
                    <p>Question type:</p>
                    <select className="rounded outline-none shadow p-2" value={typeField} onChange={(e) => {
                      if (fields.length > 0 && e.target.value === 'ESSAY') {
                        return confirmSwal('It lose all current answers', "", () => {
                          setValue('type', 'ESSAY', { shouldValidate: true })
                        })
                      }
                      setValue('type', e.target.value, { shouldValidate: true })
                    }}>
                      <option value={'ESSAY'} label="ESSAY" />
                      <option value={'FILLIN'} label="FILL IN" />
                      <option value={'CHOICE'} label="CHOICE" />
                    </select>
                  </label>
                  {errors?.type && errors?.type?.type === "required" && (
                    <div className="text-red-500 ml-20 pt-1">
                      Please input question !
                    </div>
                  )}
                </div>
              </div>
              {typeField === 'CHOICE' ? (
                <div className="text-left pl-5 mb-5 flex flex-col">
                  <p className="font-bold mt-3">Answers:</p>
                  <p className="font-thin ">Tick correct answers</p>
                  {fields.map((field, index) => {
                    return (
                      <div key={field.id} className="flex items-center my-2">
                        <input
                          className="w-5 h-5"
                          type="checkbox"
                          {...register(`choices.${index}.isTrue`)}
                        />
                        <input
                          className="ml-6 w-3/4 shadow pl-4 py-1 outline-none rounded"
                          type="text"
                          placeholder="Answer....."
                          {...register(`choices.${index}.content`, {
                            required: true,
                          })}
                        />
                        {errors?.["choices"]?.[index]?.["content"] &&
                          errors?.["choices"]?.[index]?.["content"]?.type ===
                          "required" && (
                            <div className="text-red-500">
                              Please input answer !
                            </div>
                          )}
                        <button className="ml-6" onClick={() => remove(index)}>
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  <div className="text-left">
                    <label className="cursor-pointer">
                      <IconButton className="bg-gray-300" onClick={addChoice}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <span className="m-1">Add answer</span>
                    </label>
                  </div>
                </div>
              ) : typeField === 'FILLIN' ? (
                <div className="text-left pl-5 mb-5 flex flex-col">
                  <p className="font-bold mt-3">Answers:</p>
                  <p className="font-thin ">Fill in correct answers</p>
                  {fields.map((field, index) => {
                    return (
                      <div key={field.id} className="flex items-center my-2">
                        <input
                          className="ml-6 w-3/4 shadow p-2 outline-none rounded"
                          type="text"
                          placeholder="Answer....."
                          {...register(`choices.${index}.content`, {
                            required: true,
                          })}
                        />
                        {errors?.["choices"]?.[index]?.["content"] &&
                          errors?.["choices"]?.[index]?.["content"]?.type ===
                          "required" && (
                            <div className="text-red-500">
                              Please input answer !
                            </div>
                          )}
                        <button className="ml-6" onClick={() => remove(index)}>
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  <div className="text-left">
                    <label className="cursor-pointer">
                      <IconButton className="bg-gray-300" onClick={addChoice}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <span className="m-1">Add answer</span>
                    </label>
                  </div>
                </div>
              ) : null
              }
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item className="text-left bg-gray-100">
              <div className="p-5">
                {question &&
                  question.data.map((q, index) => (
                    <button
                      onClick={() => dispatch(selectQuestionAction(q._id))}
                      className={`border-2 rounded-lg w-10 h-10 mr-1 mt-1 ${question?.selectedQuestion === q._id
                        ? "bg-gray-400 text-white"
                        : "bg-gray-50"
                        }`}
                      key={q._id}
                    >
                      {index + 1}
                    </button>
                  ))}
              </div>
              <div className="flex justify-between items-center px-10">
                {question?.selectedQuestion && (
                  <Button
                    onClick={deleteAnswer}
                    className="text-red-700 border-2 border-red-700"
                    variant="outlined"
                  >
                    Delete
                  </Button>
                )}

                <Button
                  onClick={() => {
                    dispatch(selectQuestionAction(null));
                  }}
                  variant="contained"
                  color="primary"
                >
                  New questions
                </Button>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
