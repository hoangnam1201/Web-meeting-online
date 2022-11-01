import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

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

export default function QuizAttempt() {
  return (
    <>
      <div className="pt-12">
        <h3 className="text-black font-bold text-2xl">Quiz 05</h3>
      </div>
      <Box className="p-5" sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Item>
              <div className="text-left p-5">
                <h3 className="font-bold mb-4 text-xl">Question 2 of 25</h3>
                <p>How do you write "Hello World" in an alert box?</p>
              </div>
              <div className="text-left pl-5 mb-5">
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
              <div className="text-left pl-5">
                <Button
                  className="mx-5 w-24"
                  variant="contained"
                  color="primary"
                >
                  Previous
                </Button>
                <Button className="w-24" variant="contained" color="primary">
                  Next
                </Button>
              </div>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item className="text-left">
              <div className="py-2">
                <span className="font-bold px-5">Time out of:</span>
                30:52
              </div>
              <div>
                <div className="py-2">
                  <span className="font-bold px-5">Start time:</span> 9:00 AM
                  1/11/2022
                </div>
                <div className="py-2">
                  <span className="font-bold px-5">End time:</span> 10:00 AM
                  1/11/2022
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
                  Finish Attempt
                </Button>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
