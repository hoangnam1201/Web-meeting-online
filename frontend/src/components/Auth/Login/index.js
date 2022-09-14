import React, { useEffect, useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
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
import { Link, useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthBackground from "../../../assets/auth_background.jpg";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Helmet } from "react-helmet";
import { useCookies } from "react-cookie";
import { googleLoginAPI, loginAPI } from "../../../api/user.api";
import imgLogo from "../../../assets/logomeeting.png";
import { useDispatch } from "react-redux";
import { actionRemoveUserInfo } from "../../../store/actions/userInfoAction";

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
  // containerMobile: {
  //   paddingTop: theme.spacing(8),
  //   paddingBottom: theme.spacing(6),
  // },
  containerDesktop: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-60%)",
  },

  paper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    background: "white",

    borderRadius: "10px",
    padding: "10px",

    boxShadow:
      "-40px 40px 160px 0 rgb(0 0 0 / 8%), -8px 8px 15px 0 rgb(120 120 120 / 4%), 3px 3px 30px 0 rgb(0 0 0 / 4%)",
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "10px",
  },
  submit: {
    margin: "30px 0 20px",
    padding: "10px 0",
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

const schema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập tài khoản !"),
  password: yup.string().required("Vui lòng nhập mật khẩu !"),
});

function Login(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const matches = useMediaQuery("(min-height:650px)");
  const [cookies, setCookies, removeCookies] = useCookies(["u_auth"]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const location = useLocation();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (localStorage.getItem("remember")) {
      setRemember(true);
      setUser(JSON.parse(localStorage.getItem("remember")));
    }
  }, []);

  useEffect(() => {
    if (location.state !== "LOGOUT") return;
    dispatch(actionRemoveUserInfo());
    removeCookies("u_auth", { path: "/" });
    history.replace({ ...history.location, state: null });
  }, [location.state]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (data) => {
    setLoading(true);

    loginAPI(data)
      .then((result) => {
        setLoading(false);
        setLoginError(null);
        if (remember) {
          localStorage.setItem("remember", JSON.stringify(data));
        } else {
          localStorage.removeItem("remember");
        }

        setCookies("u_auth", result, { path: "/" });

        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          history.push("/user/my-event");
        });
      })
      .catch((errors) => {
        setLoading(false);
        if (errors?.response?.data?.err) {
          setLoginError(errors?.response?.data?.err);
          return;
        }
        if (errors?.response?.data?.errors) {
          setLoginError(errors?.response?.data?.errors[0].msg);
          return;
        }
      });
  };

  // Login with google
  const handleLoginGoogle = (googleData) => {
    setLoading(true);
    googleLoginAPI(googleData.credential)
      .then((res) => {
        setLoading(false);
        setLoginError(null);
        setCookies("u_auth", res, { path: "/" });
      })
      .catch((errors) => {
        setLoading(false);
        if (errors?.response?.data?.err) {
          setLoginError(errors?.response?.data?.err);
          return;
        }
        if (errors?.response?.data?.errors) {
          setLoginError(errors?.response?.data?.errors[0].msg);
          return;
        }
      });
  };

  useEffect(() => {
    // eslint-disable-next-line no-undef
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID,
      callback: handleLoginGoogle,
      auto_select: false,
    });
    // eslint-disable-next-line no-undef
    google.accounts.id.renderButton(document.getElementById("googleLogin"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Đăng nhập</title>
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
            <Typography component="h4" variant="h4" className="my-6">
              Đăng Nhập
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                id="username"
                label="Tài khoản"
                name="username"
                autoComplete="username"
                inputRef={register}
                error={!!errors.username}
                helperText={errors?.username?.message}
                value={user.username}
                onChange={handleChange}
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
                inputRef={register}
                error={!!errors.password}
                helperText={errors?.password?.message}
                value={user.password}
                onChange={handleChange}
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
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={remember}
                  />
                }
                label="Nhớ mật khẩu"
                onChange={() => setRemember(!remember)}
              />
              {/* // In ra loi neu dang nhap that bai */}
              {loginError ? (
                <Alert style={{ marginTop: "15px" }} severity="error">
                  {loginError}
                </Alert>
              ) : null}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Đăng Nhập
              </Button>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Link
                    to="/forgot"
                    variant="h6"
                    className={classes.bottomLink}
                  >
                    Quên mật khẩu ?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    to="/auth/register"
                    variant="h6"
                    className={classes.bottomLink}
                  >
                    Đăng ký ngay tại đây
                  </Link>
                </Grid>
              </Grid>
            </form>
            <Link to="/home" className={classes.closeBox}>
              <CancelIcon />
            </Link>
            <div className="flex justify-center flex-col items-center">
              <h2 className="font-bold mt-3 border-b-2 border-black w-40">
                Or
              </h2>

              <div id="googleLogin"></div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Login;
