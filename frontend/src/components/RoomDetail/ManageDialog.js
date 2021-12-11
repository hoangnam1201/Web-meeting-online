import React, { useState } from "react";
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
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { actGetTable } from "./modules/action";
import { useCookies } from "react-cookie";

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
  name: yup.string().required("Vui lòng nhập tên bàn !!!"),
  numberOfSeat: yup.string().required("Vui lòng nhập số lượng ghế!"),
});
const ManageDialog = (props) => {
  const classes = useStyles();
  const { openDialog, setOpenDialog, handleCloseDialog, modal, roomID } = props;
  const [cookies] = useCookies(["u_auth"]);
  const dispatch = useDispatch();

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const [tableRoom, setTableRoom] = useState({ ...props.tableRoom });
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setTableRoom({
      ...tableRoom,
      [name]: value,
    });
  };

  const onAddSubmit = (data) => {
    data["room"] = roomID;
    axios({
      url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/table`,
      method: "POST",
      data,
      headers: {
        Authorization: `token ${cookies.u_auth.accessToken}`,
      },
    })
      .then(() => {
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Tạo bàn thành công",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          dispatch(actGetTable(roomID));
        });
      })
      .catch((error) => {
        console.log(error);
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
                  label="Tên bàn"
                  name="name"
                  autoComplete="name"
                  inputRef={register}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  value={tableRoom.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="numberOfSeat"
                  label="Số lượng ghế"
                  name="numberOfSeat"
                  autoComplete="numberOfSeat"
                  inputRef={register}
                  error={!!errors.numberOfSeat}
                  helperText={errors?.numberOfSeat?.message}
                  value={tableRoom.numberOfSeat}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={modal.id === "tao" ? handleSubmit(onAddSubmit) : null}
          >
            {modal.button}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageDialog;
