import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import QuestionDialog from "./createDialog";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

let arrQuestion = [
  {
    id: 1,
    ques: "dsadasdsa",
  },
  {
    id: 1,
    ques: "dsadasdsa",
  },
  {
    id: 1,
    ques: "dsadasdsa",
  },
  {
    id: 1,
    ques: "dsadasdsa",
  },
  {
    id: 1,
    ques: "dsadasdsa",
  },
  {
    id: 1,
    ques: "dsadasdsa",
  },
  {
    id: 1,
    ques: "dsadasdsa",
  },
];

export default function QuizManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });
  const handleAdd = () => {
    setModal({
      title: "Create question",
      button: "Create",
      id: "tao",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <QuestionDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleCloseDialog={handleCloseDialog}
        modal={modal}
      />
      <div className="pt-12">
        <h3 className="text-black font-bold text-2xl">Javascipt quiz test</h3>
      </div>
      <Box className="p-5" sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Item>
              <div className="text-left p-5">
                <div className="flex justify-between">
                  <h3 className="font-bold mb-4 text-xl">Question 2 of 25</h3>
                  <Button
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                  >
                    Create question
                  </Button>
                </div>
                <p>How do you write "Hello World" in an alert box?</p>
              </div>
              <div className="text-left pl-5 mb-5 flex flex-col">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Đáp án A"
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="Đáp án B"
                    />
                    <FormControlLabel
                      value="3"
                      control={<Radio />}
                      label="Đáp án C"
                    />
                    <FormControlLabel
                      value="4"
                      control={<Radio />}
                      label="Đáp án D"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item className="text-left">
              <div className="py-2">
                <TextField label="Make time" fullWidth />
              </div>
              <div>
                <div className="py-2">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      margin="dense"
                      id="date-picker-dialog-register"
                      label="Start Time"
                      inputFormat="MM/dd/yyyy"
                      renderInput={(params) => (
                        <TextField className="my-2" fullWidth {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </div>
                <div className="py-2">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      margin="dense"
                      id="date-picker-dialog-register"
                      label="End Time"
                      inputFormat="MM/dd/yyyy"
                      renderInput={(params) => (
                        <TextField className="my-2" fullWidth {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="p-5">
                {arrQuestion &&
                  arrQuestion.map((q, index) => (
                    <button className="border-2 w-10 h-10 mr-1" key={index}>
                      {index + 1}
                    </button>
                  ))}
              </div>
              <div className="text-center">
                <Button variant="contained" color="primary">
                  Save
                </Button>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
