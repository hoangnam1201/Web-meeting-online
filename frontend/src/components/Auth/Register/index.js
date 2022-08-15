import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Alert,
  Grid,
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import imgLogo from "../../../assets/logomeeting.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import AuthBackground from "../../../assets/auth_background.jpg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { ScaleLoader } from "react-spinners";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Helmet } from "react-helmet";
import { registerAPI } from "../../../api/user.api";

const useStyles = makeStyles((theme) => ({
  root: {},
  backImg: {
    position: "fixed",
    top: 0,
    left: 0,

    minWidth: "100%",
    minHeight: "100%",
  },
  // container chứa form
  containerMobile: {
    paddingTop: "80px",
    paddingBottom: "60px",
  },
  containerDesktop: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-60%)",
  },
  ///////////////////////
  paper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    background: "White",

    borderRadius: "10px",
    padding: "40px",

    boxShadow:
      "-40px 40px 160px 0 rgb(0 0 0 / 8%), -8px 8px 15px 0 rgb(120 120 120 / 4%), 3px 3px 30px 0 rgb(0 0 0 / 4%)",
  },

  form: {
    width: "100%",
    marginTop: "10px",
  },
  submit: {
    margin: "30px 0 20px",
    padding: "10px 0px",
  },

  bottomLink: {
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: 600,

    color: "red",
  },

  closeBox: {
    position: "absolute",
    top: "-18px",
    right: "-18px",

    width: "36px",
    height: "36px",
    borderRadius: "50%",

    color: "#455570",
    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 50%)",
    cursor: "pointer",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    transition: "all .2s",

    "&:hover": {
      opacity: ".7",
    },
  },

  datePicker: {
    display: "flex",
  },

  radioGroup: {
    flexDirection: "row",
  },

  // Loader
  loaderBox: {
    display: "inline-block",
    zIndex: "100",

    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  loaderRoot: {
    opacity: 0.5,
  },
}));

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Tên tài khoản đang trống !")
    .min(5, "Tên tài khoản phải từ 5 đến 16 kí tự")
    .max(16, "Tên tài khoản phải từ 5 đến 16 kí tự"),
  password: yup
    .string()
    .required("Mật khẩu đang trống !")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
    .max(16, "Mật khẩu chỉ tối đa 18 kí tự"),
  passwordConfirmation: yup
    .string()
    .required("Xác nhận mật khẩu đang trống !")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp !"),
  name: yup.string().required("Họ và tên đang trống !"),
  email: yup
    .string()
    .required("Email đang trống !")
    .email("Email không đúng định dạng"),
  phone: yup
    .string()
    .required("Số điện thoại đang trống !")
    .matches(phoneRegExp, "Số điện thoại không đúng định dạng !"),
});

function Register(props) {
  const history = useHistory();
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const matches = useMediaQuery("(min-height:1350px)");

  const [loading, setLoading] = useState(false);
  const [registerError, setregisterError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date("2000-08-29"));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickConfirmShowPassword = () => {
    setConfirmShowPassword(!confirmShowPassword);
  };
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (data) => {
    data["dob"] = moment(selectedDate).format("yyyy-MM-DD");
    setLoading(true);
    registerAPI(data)
      .then((result) => {
        setLoading(false);
        setregisterError(null);

        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công",
        });
        history.replace("/auth/login");
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.msg) {
          setregisterError(error?.response?.data?.msg);
        }
        if (error?.response?.data?.errors[0].msg) {
          setregisterError(error?.response?.data?.errors[0].msg);
        }
        if (error?.response?.data?.err) {
          setregisterError(error?.response?.data?.err);
        }
      });
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký</title>
        <meta charSet="utf-8" name="description" content="Trang chủ" />
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
      <div className={`${classes.root} ${loading ? classes.loaderRoot : null}`}>
        <img alt="bg" src={AuthBackground} className={classes.backImg} />
        <Container
          className={`${classes.containerMobile} ${
            matches ? classes.containerDesktop : null
          }`}
          component="main"
          maxWidth="xs"
        >
          <CssBaseline />
          <div className={classes.paper}>
            {/* <Avatar src={LogoMeeting} className={classes.avatar}></Avatar> */}
            <img src={imgLogo} alt="" height={300} width={300} />
            <Typography className="my-6" component="h4" variant="h4">
              Đăng ký
            </Typography>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={classes.form}
              noValidate
            >
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                id="username"
                label="Tên tài khoản"
                name="username"
                autoComplete="username"
                inputRef={register}
                error={!!errors.username}
                helperText={errors?.username?.message}
              />
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="password"
                label="Mật Khẩu"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputRef={register}
                error={!!errors.password}
                helperText={errors?.password?.message}
              />
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="passwordConfirmation"
                label="Xác nhận mật khẩu"
                type={confirmShowPassword ? "text" : "password"}
                id="passwordConfirmation"
                autoComplete="passwordConfirmation"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickConfirmShowPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                        color="secondary"
                      >
                        {confirmShowPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputRef={register}
                error={!!errors.passwordConfirmation}
                helperText={errors?.passwordConfirmation?.message}
              />
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="name"
                label="Họ và Tên"
                id="name"
                autoComplete="name"
                inputRef={register}
                error={!!errors.name}
                helperText={errors?.name?.message}
              />
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="email"
                label="Email"
                id="email"
                autoComplete="email"
                inputRef={register}
                error={!!errors.email}
                helperText={errors?.email?.message}
              />

              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="phone"
                label="Số điện thoại"
                id="phone"
                autoComplete="phone"
                inputRef={register}
                error={!!errors.phone}
                helperText={errors?.phone?.message}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  margin="dense"
                  id="date-picker-dialog-register"
                  label="Ngày tháng năm sinh"
                  inputFormat="MM/dd/yyyy"
                  name="dob"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className={classes.datePicker}
                  renderInput={(params) => (
                    <TextField className="my-2" fullWidth {...params} />
                  )}
                />
              </LocalizationProvider>

              {/* In ra loi neu dang nhap that bai */}
              {registerError ? (
                <Alert style={{ marginTop: "15px" }} severity="error">
                  {registerError}
                </Alert>
              ) : null}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Đăng Ký
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    to="/auth/login"
                    variant="h6"
                    className={classes.bottomLink}
                  >
                    Bạn đã là thành viên? Đăng nhập ngay
                  </Link>
                </Grid>
              </Grid>
            </form>
            <Link to="/home" className={classes.closeBox}>
              <CancelIcon />
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Register;
