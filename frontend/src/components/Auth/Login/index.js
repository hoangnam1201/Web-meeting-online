import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCookies } from "react-cookie";
import { googleLoginAPI, loginAPI } from "../../../api/user.api";
import imgLogo from "../../../assets/logomeeting.png";
import { CircularProgress } from "@mui/material";

const schema = yup.object().shape({
  username: yup.string().required("username is required!"),
  password: yup.string().required("password is required!"),
});

function Login(props) {
  const history = useHistory();
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
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (localStorage.getItem("remember")) {
      setRemember(true);
      setUser(JSON.parse(localStorage.getItem("remember")));
    }
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setUser({
      ...user,
      [name]: value,
    });
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
        const path = location.state?.targetPath;
        history.push(path ? path : "/user/my-event");
        path && history.replace({ ...history?.location, state: null });
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
        const path = location.state?.targetPath;
        history.push(path ? path : "/user/my-event");
        path && history.replace({ ...history?.location, state: null });
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
    window.google?.accounts.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID,
      callback: handleLoginGoogle,
      auto_select: false,
    });
    // eslint-disable-next-line no-undef
    window.google?.accounts.id.renderButton(
      document.getElementById("googleLogin"),
      {
        theme: "outline",
        size: "large",
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-50">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-10">
          <CircularProgress color="warning" />
        </div>
      )}

      <div
        className=" bg-orange-200 p-10"
        style={{ borderRadius: "90% 50% 70% 80% / 50% 50% 80%" }}
      >
        <div
          className=" bg-orange-100 p-10"
          style={{ borderRadius: "90% 50% 70% 80% / 50% 50% 80%" }}
        >
          <div
            className="w-96 bg-orange-50 p-10"
            style={{ borderRadius: "90% 50% 70% 80% / 50% 50% 80%" }}
          >
            <img
              src={imgLogo}
              alt="logo"
              className="h-14 w-auto ml-auto mr-auto"
            />
            <p className="text-2xl font-semibold my-1 tracking-wider text-orange-500">
              Sign In
            </p>
            <TextField
              margin="none"
              fullWidth={true}
              id="username"
              label="Username*:"
              name="username"
              color="warning"
              autoComplete="username"
              inputRef={register}
              error={!!errors.username}
              helperText={
                errors?.username?.message ? errors?.username?.message : " "
              }
              value={user.username}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="none"
              fullWidth
              color="warning"
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password*:"
              id="password"
              inputRef={register}
              error={!!errors.password}
              helperText={
                errors?.password?.message ? errors?.password?.message : " "
              }
              value={user.password}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  sx={{ color: "#fdba74" }}
                  checked={remember}
                />
              }
              sx={{ color: "#fdba74" }}
              onChange={() => setRemember(!remember)}
              label="Remember password"
            />
            {/* // In ra loi neu dang nhap that bai */}
            {loginError ? (
              <Alert className="mb-2" severity="error">
                {loginError}
              </Alert>
            ) : null}
            <div className=" flex flex-col gap-2 items-center">
              <button
                onClick={handleSubmit(onSubmit)}
                className="bg-white text-xl py-1 w-full outline-none
                 rounded shadow text-stone-500 tracking-wider hover:bg-stone-100 font-semibold"
              >
                Sign In
              </button>
              <Link
                to="/auth/register"
                className="text-white text-xl py-1 w-full shadow bg-stone-400 rounded tracking-wider hover:bg-stone-500 font-bold"
              >
                Sign Up
              </Link>
              <Link
                to="/home"
                className="text-white text-xl py-1 w-full shadow bg-orange-300 rounded tracking-wider hover:bg-orange-400 font-bold"
              >
                Home
              </Link>
              {/* <Link to="/forgot" variant="h6">
                Forgot Password
              </Link> */}
              <div className={`${loading && "pointer-events-none opacity-50"}`}>
                <div id="googleLogin"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
