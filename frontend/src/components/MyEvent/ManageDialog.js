import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Grid,
  Alert,
  Typography,
} from "@mui/material";
import { withStyles, makeStyles } from "@mui/styles";

import CloseIcon from "@mui/icons-material/Close";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { actGetRoom } from "./modules/action";
import { useCookies } from "react-cookie";
import { createRoomApi, updateRoomApi } from "../../api/room.api";
const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: "10px",
  },
  formControl: {
    width: "100%",
  },
  button: {
    marginRight: "8px",
  },
}));
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: "20px",
  },
  closeButton: {
    position: "absolute",
    left: "360px",
    bottom: "40px",
    color: "red",
  },
});
const DialogTitleMui = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle className={classes.root} {...other}>
      <h6>{children}</h6>
      {/* {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null} */}
    </DialogTitle>
  );
});

const DialogContentMui = withStyles(() => ({
  root: {
    padding: "20px",
  },
}))(DialogContent);

const DialogActionsMui = withStyles(() => ({
  root: {
    margin: 0,
    padding: "20px",
  },
}))(DialogActions);
const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên!!"),
  description: yup.string().required("Vui lòng nhập mô tả !!!"),
});

const ManageDialog = (props) => {
  const classes = useStyles();
  const { openDialog, setOpenDialog, handleCloseDialog, modal } = props;
  const [cookies] = useCookies(["u_auth"]);
  const dispatch = useDispatch();
  const [startDate, setStartData] = useState(Date.now());
  const [endDate, setEndDate] = useState(Date.now());
  const [roomError, setRoomError] = useState(null);
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const [roomEvent, setRoomEvent] = useState({ ...props.roomEvent });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setRoomEvent({
      ...roomEvent,
      [name]: value,
    });
  };
  useEffect(() => {
    setRoomEvent(props.roomEvent);
  }, [props.roomEvent]);
  const handleDateChange = (date) => {
    setStartData(date.getTime());
  };
  const handleDateChange2 = (date) => {
    setEndDate(date.getTime());
  };
  const onAddSubmit = () => {
    const data = {
      name: roomEvent.name,
      description: roomEvent.description,
      startDate: startDate,
      endDate: endDate,
    };
    createRoomApi(data)
      .then(() => {
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Tạo room thành công",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          dispatch(actGetRoom());
        });
      })
      .catch((error) => {
        console.log(error.response);
        // setOpenDialog(false);
        if (error?.response?.data?.msg) {
          setRoomError(error?.response?.data?.msg);
        }
        if (error?.response?.data?.errors[0].msg) {
          setRoomError(error?.response?.data?.errors[0].msg);
        }
        if (error?.response?.data?.err) {
          setRoomError(error?.response?.data?.err);
        }
      });
  };
  const onUpdateSubmit = () => {
    const data = {
      name: roomEvent.name,
      description: roomEvent.description,
      startDate: startDate,
      endDate: endDate,
    };
    updateRoomApi(roomEvent._id, data)
      .then(() => {
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          dispatch(actGetRoom());
        });
      })
      .catch((error) => {
        setOpenDialog(false);
      });
  };

  return (
    <div>
      <Dialog maxWidth="xs" onClose={handleCloseDialog} open={openDialog}>
        <DialogTitleMui>{modal.title}</DialogTitleMui>
        <DialogContentMui dividers>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="name"
                  label="Tên phòng"
                  name="name"
                  autoComplete="name"
                  inputRef={register}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  value={roomEvent.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="description"
                  label="Mô tả"
                  name="description"
                  autoComplete="description"
                  inputRef={register}
                  error={!!errors.description}
                  helperText={errors?.description?.message}
                  value={roomEvent.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    margin="dense"
                    id="date-picker-dialog-register"
                    label="Ngày bắt đầu"
                    inputFormat="MM/dd/yyyy"
                    name="startDate"
                    value={new Date(startDate)}
                    onChange={handleDateChange}
                    className={classes.datePicker}
                    renderInput={(params) => (
                      <TextField className="my-2" fullWidth {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    margin="dense"
                    id="date-picker-dialog-register2"
                    label="Ngày kết thúc"
                    inputFormat="MM/dd/yyyy"
                    name="endDate"
                    value={new Date(endDate)}
                    onChange={handleDateChange2}
                    className={classes.datePicker}
                    renderInput={(params) => (
                      <TextField className="my-2" fullWidth {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </form>
        </DialogContentMui>
        <DialogActionsMui>
          {roomError ? (
            <Alert style={{ marginTop: "15px" }} severity="error">
              {roomError}
            </Alert>
          ) : null}
          <Button
            type="submit"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={
              modal.id === "tao"
                ? handleSubmit(onAddSubmit)
                : handleSubmit(onUpdateSubmit)
            }
          >
            {modal.button}
          </Button>
        </DialogActionsMui>
      </Dialog>
    </div>
  );
};

export default ManageDialog;
