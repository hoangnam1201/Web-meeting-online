import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Box, Button, Container } from "@material-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import Alert from "@material-ui/lab/Alert";
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
  button: {
    marginTop: 10,
    width: "200px",
    marginLeft: "200px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "600px",
  },
}));

const schema = yup.object().shape({
  oldPassword: yup.string().required("Vui lòng nhập lại password cũ !"),
  password: yup.string().required("Vui lòng nhập password mới !"),
  passwordConfirmation: yup.string().required("Vui lòng nhập lại password !"),
});

export default function ChangePassword() {
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const classes = useStyles();
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [loading, setLoading] = useState(false);
  const [errorNotify, setErrorNotify] = useState(null);
  const [cookies] = useCookies(["u_auth"]);
  const [password, setPassword] = useState({
    oldPassword: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleInfoChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setPassword({
      ...password,
      [name]: value,
    });
  };

  const onPasswordSubmit = () => {
    setLoading(true);
    axios({
      url: `http://localhost:3002/api/user/change-password`,
      method: "PUT",
      data: {
        oldPassword: password.oldPassword,
        password: password.password,
        passwordConfirmation: password.passwordConfirmation,
      },
      headers: {
        Authorization: `token ${cookies.u_auth.accessToken}`,
      },
    })
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công",
          timer: 1500,
          showConfirmButton: false,
        });
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
        <title>UTE Meeting - Đổi mật khẩu</title>
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
          onSubmit={handleSubmit(onPasswordSubmit)}
        >
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            type="password"
            id="oldPassword"
            label="Mật khẩu cũ"
            name="oldPassword"
            autoComplete="oldPassword"
            inputRef={register}
            error={!!errors.oldPassword}
            helperText={errors?.oldPassword?.message}
            value={password.oldPassword}
            onChange={handleInfoChange}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            type="password"
            required
            fullWidth
            id="password"
            label="Mật khẩu mới"
            name="password"
            autoComplete="password"
            inputRef={register}
            error={!!errors.password}
            helperText={errors?.password?.message}
            value={password.password}
            onChange={handleInfoChange}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            type="password"
            id="passwordConfirmation"
            label="Xác nhận lại mật khẩu"
            name="passwordConfirmation"
            autoComplete="passwordConfirmation"
            inputRef={register}
            error={!!errors.passwordConfirmation}
            helperText={errors?.passwordConfirmation?.message}
            value={password.passwordConfirmation}
            onChange={handleInfoChange}
          />
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
