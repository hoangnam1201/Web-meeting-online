import React, { useState } from "react";
import { Box, TextField, Alert } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ScaleLoader } from "react-spinners";
import { Helmet } from "react-helmet";
import { changePasswordAPI } from "../../api/user.api";
import { LoadingButton } from "@mui/lab";
import { toastSuccess } from "../../services/toastService";

const schema = yup.object().shape({
  oldPassword: yup.string().required("Please input old password !"),
  password: yup.string().required("Please input new password !")
    .notOneOf([yup.ref('oldPassword')], 'The new password have to different old password'),
  passwordConfirmation: yup
    .string()
    .required("Please input confirmation password !")
    .oneOf([yup.ref("password")], "Password incorrect !"),
});

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [errorNotify, setErrorNotify] = useState(null);

  const onPasswordSubmit = (data) => {
    setLoading(true);
    setErrorNotify(null)

    changePasswordAPI(data)
      .then(() => {
        setLoading(false);
        toastSuccess('Change password successfull');
        reset();
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
        <title>UTE Meeting - Change password</title>
        <meta charSet="utf-8" name="description" content="changepassword" />
      </Helmet>
      <div>
        <p className="text-start text-gray-900 p-3 bg-gray-50">Change Password</p>
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
      <form
        noValidate
        onSubmit={handleSubmit(onPasswordSubmit)}
        className="flex flex-col items-start w-full md:w-1/3 p-3"
      >
        <label className="block w-full">
          <p className="text-left mt-4 text-sm">current password:</p>
          <TextField
            variant="outlined"
            required
            fullWidth
            type="password"
            {...register("oldPassword")}
            error={!!errors.oldPassword}
            helperText={errors?.oldPassword?.message}
          />
        </label>

        <label className="block w-full">
          <p className="text-left mt-4 text-sm">new password:</p>
          <TextField
            variant="outlined"
            type="password"
            required
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors?.password?.message}
          />
        </label>
        <label className="block w-full">
          <p className="text-left mt-4 text-sm">confirmation password:</p>
          <TextField
            variant="outlined"
            required
            fullWidth
            type="password"
            {...register("passwordConfirmation")}
            error={!!errors.passwordConfirmation}
            helperText={errors?.passwordConfirmation?.message}
          />
        </label>
        {errorNotify ? (
          <Alert style={{ marginTop: "15px" }} severity="error">
            {errorNotify}
          </Alert>
        ) : null}
        <LoadingButton
          loading={loading}
          className="mt-3"
          type="submit"
          variant="contained"
          autoFocus
          color="primary"
        >
          Update
        </LoadingButton>
      </form>
    </>
  );
}
