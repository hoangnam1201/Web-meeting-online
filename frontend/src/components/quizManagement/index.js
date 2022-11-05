import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, IconButton } from "@mui/material";

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
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getQuizByQuizIdAction } from "../../store/actions/quizAction";
import Swal from "sweetalert2";

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
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    mode: "onChange",
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "choices", // unique name for your Field Array
    }
  );

  useEffect(() => {
    dispatch(getQuestionAction(id));
    dispatch(getQuizByQuizIdAction(id));
  }, [id]);

  useEffect(() => {
    if (question && question.selectedQuestion) {
      const data = question.data.find(
        (q) => q._id === question.selectedQuestion
      );
      reset({
        content: data.content,
        choices: data.choices.map((c) => {
          return {
            isTrue: c.isTrue === "true" ? true : false,
            content: c.content,
          };
        }),
      });
      return;
    }
    reset({ content: "", choices: [] });
  }, [question?.selectedQuestion]);

  const addChoice = () => {
    append({ content: "", isTrue: false });
  };

  const saveQuestion = (data) => {
    const type =
      data.choices.filter((c) => c.isTrue).length > 1 ? "MULTIPLE" : "ONE";
    const questionData = { ...data, type, quiz: id };
    if (data.choices.filter((c) => c.isTrue).length <= 0) {
      Swal.fire({
        icon: "question",
        title: "Please choice a answer correct",
        text: "confirm",
        showCancelButton: true,
        confirmButtonText: "confirm",
        cancelButtonText: "cancel",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) return;
      });
      return;
    }
    if (!question.selectedQuestion) {
      dispatch(
        addQuestionAction(questionData, id, () => {
          reset();
        })
      );
      return;
    }
    dispatch(updateQuestionActon(question.selectedQuestion, questionData));
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
  };

  return (
    <>
      <div className="pt-12">
        <h3 className="text-black font-bold text-2xl">{quiz?.data?.name}</h3>
      </div>
      <Box className="p-5" sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Item>
              <div className="text-left p-5">
                <div className="flex justify-between">
                  <h3 className="font-bold mb-4 text-xl">
                    {question?.selectedQuestion
                      ? `Question ${
                          question?.data?.findIndex(
                            (q) => q._id === question.selectedQuestion
                          ) + 1
                        } of ${question.data.length}`
                      : "New question"}
                  </h3>
                  <Button
                    onClick={handleSubmit(saveQuestion)}
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                </div>
                <label className="font-bold" htmlFor="question">
                  Question:
                </label>
                <input
                  id="question"
                  className="ml-1 w-3/4 border-2 border-gray-500 pl-4 py-1"
                  {...register("content", {
                    required: true,
                  })}
                  type="text"
                />
                {errors?.content && errors?.content?.type === "required" && (
                  <div className="text-red-500 ml-20 pt-1">
                    Please input question !
                  </div>
                )}
              </div>
              <div className="text-left pl-5 mb-5 flex flex-col">
                {fields.map((field, index) => {
                  return (
                    <div key={field.id} className="flex items-center my-2">
                      <input
                        className="w-5 h-5"
                        type="checkbox"
                        {...register(`choices.${index}.isTrue`)}
                      />
                      <input
                        className="ml-6 w-3/4 border-2 border-gray-500 pl-4 py-1"
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
                        xóa
                      </button>
                    </div>
                  );
                })}
                <div className="text-left">
                  <IconButton className="bg-gray-300" onClick={addChoice}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <span>Add answer</span>
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item className="text-left">
              <div className="p-5">
                {question &&
                  question.data.map((q, index) => (
                    <button
                      onClick={() => dispatch(selectQuestionAction(q._id))}
                      className={`border-2 w-10 h-10 mr-1 mt-1 ${
                        question?.selectedQuestion === q._id
                          ? "bg-gray-200"
                          : ""
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
