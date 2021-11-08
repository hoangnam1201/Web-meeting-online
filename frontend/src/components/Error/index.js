import React from "react";
import { Box, Container, Typography, makeStyles } from "@material-ui/core";
// import Page from "../../components/Page";
import errorImage from "../../assets/undraw_page_not_found_su7k.svg";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    width: "100%",
    position: "relative",
    left: "50%",
    transform: "translate(-50%,-60%)",
  },
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },
  title: {
    fontSize: "40px",
    fontWeight: 600,
    [theme.breakpoints.down("md")]: {
      fontSize: "30px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
  },
  desc: {
    fontSize: "30px",
    fontWeight: 500,
    [theme.breakpoints.down("md")]: {
      fontSize: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const Error = ({ type }) => {
  const classes = useStyles();

  return (
    <div className="p-4">
      <img
        alt="Under development"
        className={classes.image}
        src={errorImage}
      />
      <div className="text-xl font-medium text-gray-500">
        The page you are looking for isn’t here
      </div>
      {type === 0 && <div className='py-2 px-4 bg-gray-100 rounded-md w-40 ml-auto mr-auto shadow-lg mt-4
      text-gray-500 hover:bg-gray-200'>
        <Link to="/" >Go Back Home</Link>
      </div>}
    </div>
  );
};

export default Error;
