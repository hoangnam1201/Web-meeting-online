import React, { useState } from "react";
import { TextField, Alert, CircularProgress } from "@mui/material";
import imgLogo from "../../../assets/logomeeting.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { registerAPI } from "../../../api/user.api";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  username: yup
    .string()
    .required("username is required")
    .min(5, "Length from 5 to 16 characters")
    .max(16, "Length from 2 to 3 characters"),
  password: yup
    .string()
    .required("password is requied")
    .min(8, "Length from 8 to 16 characters")
    .max(16, "Length from 8 to 16 characters"),
  passwordConfirmation: yup
    .string()
    .required("confirm password is required")
    .oneOf([yup.ref("password")], "invalid confirm password"),
  name: yup.string().required("username is required"),
  email: yup.string().required("Email is required").email("Invalid email"),
  phone: yup
    .string()
    .required("phone is required")
    .matches(phoneRegExp, "invalid phone"),
});

function Register(props) {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [registerError, setregisterError] = useState(null);

  const onSubmit = (data) => {
    setLoading(true);
    registerAPI(data)
      .then((result) => {
        setLoading(false);
        setregisterError(null);

        Swal.fire({
          icon: "success",
          title: "Register Successfull",
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
    <div className="min-h-screen flex justify-center items-center bg-orange-50">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-10">
          <CircularProgress color="warning" />
        </div>
      )}
      <div
        className=" bg-orange-200 p-10"
        style={{ borderRadius: "40% 50% 20% 30% / 30% 70% 20% 20%" }}
      >
        <div
          className=" bg-orange-100 p-10"
          style={{ borderRadius: "40% 50% 20% 30% / 30% 70% 20% 20%" }}
        >
          <div
            className="w-96 bg-orange-50 p-10"
            style={{ borderRadius: "40% 50% 20% 30% / 30% 70% 20% 20%" }}
          >
            <img
              src={imgLogo}
              alt="logo"
              referrerPolicy="no-referrer"
              className="h-14 w-auto ml-auto mr-auto"
            />
            <p className="text-2xl font-semibold my-1 tracking-wider text-orange-500">
              Sign Up
            </p>
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              id="username"
              label="Username*:"
              name="username"
              color="warning"
              autoComplete="username"
              {...register("username")}
              error={!!errors.username}
              helperText={
                errors?.username?.message ? errors?.username?.message : " "
              }
            />
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              color="warning"
              name="password"
              label="Password*:"
              type={"password"}
              id="password"
              autoComplete="password"
              {...register("password")}
              error={!!errors.password}
              helperText={
                errors?.password?.message ? errors?.password?.message : " "
              }
            />
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              color="warning"
              name="passwordConfirmation"
              label="Comfirm password*:"
              type={"password"}
              id="passwordConfirmation"
              autoComplete="passwordConfirmation"
              {...register("passwordConfirmation")}
              error={!!errors.passwordConfirmation}
              helperText={
                errors?.passwordConfirmation?.message
                  ? errors?.passwordConfirmation?.message
                  : " "
              }
            />
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              name="name"
              color="warning"
              label="Name*:"
              id="name"
              autoComplete="name"
              {...register("name")}
              error={!!errors?.name}
              helperText={errors?.name?.message ? errors?.name?.message : " "}
            />
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              name="email"
              label="Email*:"
              id="email"
              color="warning"
              autoComplete="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors?.email?.message ? errors?.email?.message : " "}
            />

            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              name="phone"
              label="Phone number*:"
              id="phone"
              color="warning"
              autoComplete="phone"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors?.phone?.message ? errors?.phone?.message : " "}
            />

            {/* In ra loi neu dang nhap that bai */}
            {registerError ? (
              <Alert style={{ marginTop: "15px" }} severity="error">
                {registerError}
              </Alert>
            ) : null}
            <div className=" flex flex-col gap-2 items-center">
              <button
                onClick={handleSubmit(onSubmit)}
                className="bg-white text-xl py-1 w-full outline-none
                 rounded shadow text-stone-500 tracking-wider hover:bg-stone-100 font-semibold"
              >
                Sign Up
              </button>
              <Link
                to="/auth/login"
                className="text-white text-xl py-1 w-full shadow bg-stone-400 rounded tracking-wider hover:bg-stone-500 font-bold"
              >
                Sign In
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
