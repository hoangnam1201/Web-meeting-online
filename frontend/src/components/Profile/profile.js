import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { changeUserInfoAPI } from "../../api/user.api";

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
  name: yup.string().min(5).required("Name đang trống !"),
  phone: yup
    .string()
    .required("Số điện thoại đang trống !")
    .min(9, "Số điện thoại ít nhất 9 ký tự")
    .max(12, "Số điện thoại tối đa 12 ký tự")
    .matches(phoneRegExp, "Số điện thoại không đúng định dạng !"),
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
          title: "Cập nhật thông tin thành công",
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
            disabled
            value={info?.username}
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
            disabled
            value={info?.email}
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

          {errorNotify ? (
            <Alert style={{ marginTop: "15px" }} severity="error">
              {errorNotify}
            </Alert>
          ) : null}
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
