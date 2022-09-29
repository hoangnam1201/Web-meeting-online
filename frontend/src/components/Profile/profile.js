import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { TextField, Box, Container, Alert } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { changeUserInfoAPI } from "../../api/user.api";
import { LoadingButton } from "@mui/lab";

const useStyles = makeStyles(() => ({
  root: { marginBottom: "100px", padding: "0 100px" },
  loaderRoot: {
    opacity: 0.5,
  },
  loaderBox: {
    display: "inline-block",
    zIndex: 999,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  tabRoot: {
    flexGrow: 1,
    backgroundColor: "white",
    display: "flex",
    height: 224,
    width: "100%",
    marginTop: 30,
    marginBottom: 100,
  },
  tabs: {
    borderRight: `1px solid black`,
  },
  button: {
    marginTop: 10,
    width: "200px",
    marginLeft: "200px",
  },
  radioGroup: {
    flexDirection: "row",
  },
  datePicker: {
    display: "flex",
    width: "600px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "600px",
  },
}));
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
  name: yup.string().min(5).required("Name đang trống !"),
  phone: yup
    .string()
    .required("Phone number is empty !")
    .min(9, "Phone number at least 9 characters")
    .max(12, "Phone number up to 12 characters")
    .matches(phoneRegExp, "Phone number incorrect format !"),
});

export default function Profiles() {
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const classes = useStyles();
  const loginInfo = useSelector((state) => state.userReducer?.user);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [info, setInfo] = useState(null);
  const [errorNotify, setErrorNotify] = useState(null);

  useEffect(() => {
    setInfo({ ...loginInfo });
    setSelectedDate(new Date(loginInfo?.dob));
  }, [loginInfo]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleInfoChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setInfo({
      ...info,
      [name]: value,
    });
  };

  const onInfoSubmit = () => {
    const date = moment(selectedDate).format("yyyy-MM-DD");
    let data = {
      name: info.name,
      dob: date,
      phone: info.phone,
    };
    setLoading(true);
    changeUserInfoAPI(data)
      .then((res) => {
        setLoading(false);
        setErrorNotify(null);
        Swal.fire({
          icon: "success",
          title: "Update profile successfull !",
          timer: 1500,
          showConfirmButton: false,
        });
        loginInfo.name = res.data.name;
        loginInfo.dob = res.data.dob;
        loginInfo.phone = res.data.phone;
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.msg) {
          setErrorNotify(error?.response?.data?.msg);
        }
        if (error?.response?.data?.errors[0].msg) {
          setErrorNotify(error?.response?.data?.errors[0].msg);
        }
        if (error?.response?.data?.err) {
          setErrorNotify(error?.response?.data?.err);
        }
      });
  };
  return (
    <>
      <Helmet>
        <title>UTE Meeting - Profile</title>
        <meta charSet="utf-8" name="description" content="Profile" />
      </Helmet>
      <Box className={classes.loaderBox}>
        <ScaleLoader
          color="#f50057"
          loading={loading}
          height={45}
          width={5}
          radius={10}
          margin={4}
        />
      </Box>
      <Container className={`${classes.root} ${loading ? `opacity-50` : null}`}>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onInfoSubmit)}
        >
          <TextField
            focused
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            disabled
            value={info?.username}
          />
          <TextField
            focused
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="name"
            label="Fullname"
            name="name"
            autoComplete="name"
            inputRef={register}
            error={!!errors.name}
            helperText={errors?.name?.message}
            value={info?.name}
            onChange={handleInfoChange}
          />
          <TextField
            focused
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="phone"
            label="Phone number"
            name="phone"
            autoComplete="phone"
            inputRef={register}
            error={!!errors.phone}
            helperText={errors?.phone?.message}
            value={info?.phone}
            onChange={handleInfoChange}
          />
          <TextField
            focused
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            disabled
            value={info?.email}
          />
          <LocalizationProvider
            className={classes.input}
            dateAdapter={DateFnsUtils}
          >
            <DesktopDatePicker
              margin="dense"
              id="date-picker-dialog-register"
              label="Birthday"
              inputFormat="MM/dd/yyyy"
              name="dob"
              value={selectedDate}
              onChange={handleDateChange}
              className={classes.datePicker}
            />
          </LocalizationProvider>

          {errorNotify ? (
            <Alert style={{ marginTop: "15px" }} severity="error">
              {errorNotify}
            </Alert>
          ) : null}
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            type="submit"
            variant="contained"
            autoFocus
            color="primary"
            className={classes.button}
          >
            Update
          </LoadingButton>
        </form>
      </Container>
    </>
  );
}
