import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Box, Button, Container } from "@material-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import Swal from "sweetalert2";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 224,
    width: "100%",
    marginTop: 30,
    marginBottom: 100,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
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
  name: yup.string().required("Name đang trống !"),
  phone: yup
    .string()
    .required("Số điện thoại đang trống !")
    .matches(phoneRegExp, "Số điện thoại không đúng định dạng !"),
});

export default function Profiles() {
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const classes = useStyles();
  const loginInfo = useSelector(state => state.userReducer?.user);
  const [cookies] = useCookies(['u_auth']);
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
    axios
      .put(
        "http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/user/change-infor",
        data,
        {
          headers: {
            Authorization: `token ${cookies.u_auth.accessToken}`,
          }
        },
      )
      .then((res) => {
        setLoading(false);
        setErrorNotify(null);
        Swal.fire({
          icon: "success",
          title: "Cập nhật thông tin thành công",
          timer: 1500,
          showConfirmButton: false,
        });
        loginInfo.name = res.data.data.name;
        loginInfo.dob = res.data.data.dob;
        loginInfo.phone = res.data.data.phone;
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data && error.response) {
          setErrorNotify(error.response.data);
        }
      });
  };
  return (
    <>
      <Helmet>
        <title>UTE Meeting - Hồ sơ cá nhân</title>
        <meta
          charSet="utf-8"
          name="description"
          content="Trang hồ sơ cá nhân"
        />
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
      <Container className={classes.root}>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onInfoSubmit)}
        >
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            inputRef={register}
            error={!!errors.username}
            helperText={errors?.username?.message}
            value={info?.username}
            onChange={handleInfoChange}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="name"
            label="Họ Tên"
            name="name"
            autoComplete="name"
            inputRef={register}
            error={!!errors.name}
            helperText={errors?.name?.message}
            value={info?.name}
            onChange={handleInfoChange}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="phone"
            label="Số điện thoại"
            name="phone"
            autoComplete="phone"
            inputRef={register}
            error={!!errors.phone}
            helperText={errors?.phone?.message}
            value={info?.phone}
            onChange={handleInfoChange}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            inputRef={register}
            error={!!errors.email}
            helperText={errors?.email?.message}
            value={info?.email}
            onChange={handleInfoChange}
          />
          <MuiPickersUtilsProvider
            className={classes.input}
            utils={DateFnsUtils}
          >
            <KeyboardDatePicker
              margin="dense"
              id="date-picker-dialog-register"
              label="Ngày tháng năm sinh"
              format="MM/dd/yyyy"
              name="dob"
              value={selectedDate}
              onChange={handleDateChange}
              className={classes.datePicker}
            />
          </MuiPickersUtilsProvider>

          {errorNotify ? <h5>{errorNotify}</h5> : null}
          <Button
            type="submit"
            variant="contained"
            autoFocus
            color="primary"
            className={classes.button}
          >
            Thay đổi
          </Button>
        </form>
      </Container>
    </>
  );
}
