import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { actGetRoom } from "./modules/action";
import { useCookies } from "react-cookie";
import Alert from "@material-ui/lab/Alert";
const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
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
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "red",
  },
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography color="secondary" variant="h6" align="center">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
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
    // data["startDate"] = moment(startDate).format("yyyy-MM-DD");
    // data["endDate"] = moment(endDate).format("yyyy-MM-DD");
    axios({
      url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/room`,
      method: "POST",
      data: {
        name: roomEvent.name,
        description: roomEvent.description,
        startDate: startDate,
        endDate: endDate,
      },
      headers: {
        Authorization: `token ${cookies.u_auth.accessToken}`,
      },
    })
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
    axios({
      url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/room/${roomEvent._id}`,
      method: "PUT",
      data: {
        name: roomEvent.name,
        description: roomEvent.description,
        startDate: startDate,
        endDate: endDate,
      },
      headers: {
        Authorization: `token ${cookies.u_auth.accessToken}`,
      },
    })
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
        <DialogTitle onClose={handleCloseDialog}>{modal.title}</DialogTitle>
        <DialogContent dividers>
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
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="dense"
                    id="date-picker-dialog-register"
                    label="Ngày bắt đầu"
                    format="MM/dd/yyyy"
                    name="startDate"
                    value={new Date(startDate)}
                    onChange={handleDateChange}
                    className={classes.datePicker}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="dense"
                    id="date-picker-dialog-register2"
                    label="Ngày kết thúc"
                    format="MM/dd/yyyy"
                    name="endDate"
                    value={new Date(endDate)}
                    onChange={handleDateChange2}
                    className={classes.datePicker}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageDialog;
