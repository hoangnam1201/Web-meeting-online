import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

const DialogTitleMui = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle className="dialog-title" {...other}>
      <span>{children}</span>
    </DialogTitle>
  );
};

const QuestionDialog = (props) => {
  const { openDialog, setOpenDialog, handleCloseDialog, modal } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onAddSubmit = () => {};

  return (
    <>
      <div>
        <Dialog
          className="relative"
          maxWidth="xs"
          onClose={handleCloseDialog}
          open={openDialog}
        >
          <DialogTitleMui>{modal?.title}</DialogTitleMui>
          <DialogContent dividers>
            <form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    label="Question"
                    autoComplete="question"
                    {...register("question", {
                      required: "required",
                    })}
                    error={!!errors.question}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    label="Answer 1"
                    autoComplete="answer1"
                    {...register("answer1", {
                      required: "required",
                    })}
                    error={!!errors.question}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    label="Answer 2"
                    autoComplete="answer2"
                    {...register("answer2", {
                      required: "required",
                    })}
                    error={!!errors.question}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    label="Answer 3"
                    autoComplete="answer3"
                    {...register("answer3", {
                      required: "required",
                    })}
                    error={!!errors.question}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    label="Answer 4"
                    autoComplete="answer4"
                    {...register("answer4", {
                      required: "required",
                    })}
                    error={!!errors.question}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    label="Correct Answer"
                    autoComplete="correctAnswer"
                    {...register("correctAnswer", {
                      required: "required",
                    })}
                    error={!!errors.question}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="info"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              onClick={modal.id === "tao" ? handleSubmit(onAddSubmit) : null}
            >
              {modal.button}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default QuestionDialog;
