import React, { useEffect, useState } from "react";
import { TextField, Box, Avatar, Alert } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ScaleLoader } from "react-spinners";
import ReactAvatar from 'react-avatar';
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { changeUserInfoAPI } from "../../api/user.api";
import { LoadingButton } from "@mui/lab";
import { toastSuccess } from "../../services/toastService";
import { setUserInfo } from "../../store/actions/userInfoAction";

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
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const loginInfo = useSelector((state) => state.userReducer?.user);
  const [loading, setLoading] = useState(false);
  const [errorNotify, setErrorNotify] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    resetForm();
  }, [loginInfo])
  const resetForm = () => {
    if (loginInfo)
      reset({
        username: loginInfo.name,
        name: loginInfo.name,
        phone: loginInfo.phone,
        email: loginInfo.email
      })
  }

  const onInfoSubmit = (data) => {
    setLoading(true);
    changeUserInfoAPI(data)
      .then((res) => {
        setLoading(false);
        setErrorNotify(null);
        toastSuccess('successfull')
        dispatch(setUserInfo({ ...loginInfo, name: data.name, phone: data.phone }))
      })
      .catch((error) => {
        resetForm();
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
      <div>
        <p className="text-start text-gray-900 p-3 bg-gray-50">User Information</p>
      </div>
      <Box>
        <ScaleLoader
          color="#f50057"
          loading={loading}
          height={45}
          width={5}
          radius={10}
          margin={4}
        />
      </Box>
      <div className="flex flex-col items-start justify-start p-4">
        <div>
          <p className="text-left text-sm">Avatar:</p>
          {loginInfo?.picture ? (
            <Avatar src={loginInfo.picture} sx={{ width: 60, height: 60 }} />
          ) : <ReactAvatar
            name={loginInfo?.name}
            size={60}
            round
          />}
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onInfoSubmit)}
          className="flex flex-col items-start w-full md:w-1/3 "
        >
          <label className="block w-full">
            <p className="text-left mt-4 text-sm">Username:</p>
            <TextField
              focused
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              required
              id="username"
              {...register('username')}
              disabled
            />
          </label>
          <label className="block w-full mt-2">
            <p className="text-left text-sm">name:</p>
            <TextField
              focused
              variant="outlined"
              required
              fullWidth
              id="name"
              {...register("name")}
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
          </label>
          <label className="block w-full mt-2">
            <p className="text-left text-sm">phone:</p>
            <TextField
              focused
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{ shrink: true }}
              autoComplete="phone"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors?.phone?.message}
            />
          </label>
          <label className="block w-full mt-2">
            <p className="text-left">email:</p>
            <TextField
              focused
              fullWidth
              variant="outlined"
              margin="dense"
              required
              id="email"
              label="Email"
              name="email"
              disabled
              InputLabelProps={{ shrink: true }}
              {...register('email')}
            />
          </label>
          {errorNotify ? (
            <Alert style={{ marginTop: "15px" }} severity="error">
              {errorNotify}
            </Alert>
          ) : null}
          {isDirty && <div>
            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Update
            </LoadingButton>
            <LoadingButton
              loading={loading}
              type="button"
              variant="contained"
              color="inherit"
              className="ml-2"
              onClick={resetForm}
            >
              cancel
            </LoadingButton>
          </div>
          }
        </form>
      </div>
    </>
  );
}
