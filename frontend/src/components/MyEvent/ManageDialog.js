import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  LinearProgress,
} from "@mui/material";
import { withStyles, makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { addRoomAction, updateRoomAction } from "./modules/action";
import { LoadingButton } from "@mui/lab";

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
      <p>{children}</p>
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
  name: yup.string().required("Please input your room name !!"),
  description: yup.string().required("Please input description !!!"),
});

const ManageDialog = (props) => {
  const classes = useStyles();
  const { openDialog, setOpenDialog, handleCloseDialog, modal, roomEvent } =
    props;

  const dispatch = useDispatch();

  const room = useSelector((state) => state.listRoomReducer);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  // const [roomEvent, setRoomEvent] = useState({ ...props.roomEvent });

  // useEffect(() => {
  //   setRoomEvent(props.roomEvent);
  // }, [props.roomEvent]);
  useEffect(() => {
    if (roomEvent) {
      reset({
        name: roomEvent.name,
        description: roomEvent.description,
        startDate: roomEvent.startDate,
        endDate: roomEvent.endDate,
      });
    } else {
      reset({
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
      });
    }
  }, [roomEvent]);
  const handleDateChange = (date) => {
    setValue("startDate", date.getTime(), { shouldValidate: true });
  };
  const handleDateChange2 = (date) => {
    setValue("endDate", date.getTime(), { shouldValidate: true });
  };
  const onAddSubmit = (data) => {
    dispatch(
      addRoomAction(data, () => {
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Create roon successfull !",
          timer: 1500,
          showConfirmButton: false,
        });
      })
    );
  };
  const onUpdateSubmit = (data) => {
    dispatch(
      updateRoomAction(roomEvent._id, data, () => {
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Update room successfull !",
          timer: 1500,
          showConfirmButton: false,
        });
      })
    );
  };

  return (
    <>
      <div>
        <Dialog
          className="relative"
          maxWidth="xs"
          onClose={handleCloseDialog}
          open={openDialog}
        >
          {room?.loading && <LinearProgress />}
          <DialogTitleMui>{modal.title}</DialogTitleMui>
          <DialogContentMui dividers>
            <form className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    id="name"
                    label="Room name"
                    name="name"
                    autoComplete="name"
                    {...register("name")}
                    error={!!errors?.name}
                    helperText={errors?.name?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    autoComplete="description"
                    {...register("description")}
                    error={!!errors?.description}
                    helperText={errors?.description?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      margin="dense"
                      id="date-picker-dialog-register"
                      label="Start Date"
                      inputFormat="MM/dd/yyyy"
                      name="startDate"
                      value={new Date(getValues("startDate"))}
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
                      label="End Date"
                      inputFormat="MM/dd/yyyy"
                      name="endDate"
                      value={new Date(getValues("endDate"))}
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
            {/* {roomError ? (
              <Alert style={{ marginTop: "15px" }} severity="error">
                {roomError}
              </Alert>
            ) : null} */}
            <LoadingButton
              loading={room?.loading}
              loadingPosition="start"
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
            </LoadingButton>
          </DialogActionsMui>
        </Dialog>
      </div>
    </>
  );
};

export default ManageDialog;
