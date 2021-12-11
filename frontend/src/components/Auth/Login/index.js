import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import LogoMeeting from "../../../assets/logomeeting.png";
import { Link, useHistory } from "react-router-dom";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthBackground from "../../../assets/auth_background.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { useCookies } from "react-cookie";
import { loginAPI } from "../../../api/user.api";
import Alert from "@material-ui/lab/Alert";

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
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(6),
  },
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

    background: theme.palette.common.white,

    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),

    boxShadow:
      "-40px 40px 160px 0 rgb(0 0 0 / 8%), -8px 8px 15px 0 rgb(120 120 120 / 4%), 3px 3px 30px 0 rgb(0 0 0 / 4%)",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1, 0),
  },

  bottomLink: {
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: 600,

    color: theme.palette.secondary.main,
  },

  closeBox: {
    position: "absolute",
    top: "-18px",
    right: "-18px",

    width: "36px",
    height: "36px",
    borderRadius: "50%",

    backgroundColor: theme.palette.primary.main,
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
  const matches = useMediaQuery("(min-height:650px)");
  const [cookies, setCookies] = useCookies(["u_auth"]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  useEffect(() => {
    if (localStorage.getItem("remember")) {
      setRemember(true);
      setUser(JSON.parse(localStorage.getItem("remember")));
    }
  }, []);

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
      <div className={classes.root}>
        <img alt="bg" src={AuthBackground} className={classes.backImg} />
        <Container
          className={`${classes.containerMobile} ${matches ? classes.containerDesktop : null
            }`}
          component="main"
          maxWidth="xs"
        >
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar src={LogoMeeting} className={classes.avatar}></Avatar>
            <Typography component="h3" variant="h3">
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
              <CloseRoundedIcon />
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Login;
