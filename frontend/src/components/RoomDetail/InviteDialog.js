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
import { actGetMember } from "./modules/action";
import { useDispatch } from "react-redux";

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
  userId: yup.string().required("Vui lòng nhập ID bàn !!!"),
});
const ManageDialog = (props) => {
  const classes = useStyles();
  const { openDialog2, setOpenDialog2, handleCloseDialog2, modal, roomID } =
    props;
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const [member, setMember] = useState({ ...props.tableRoom });
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setMember({
      ...member,
      [name]: value,
    });
  };

  const onAddSubmit = (data) => {
    axios({
      url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/room/members/add-member/${roomID}`,
      method: "POST",
      data,
      headers: {
        Authorization: `token ${accessToken.accessToken}`,
      },
    })
      .then(() => {
        setOpenDialog2(false);
        Swal.fire({
          icon: "success",
          title: "Thêm khách mời thành công",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          dispatch(actGetMember());
        });
      })
      .catch((error) => {
        setOpenDialog2(false);
      });
  };

  return (
    <div>
      <Dialog maxWidth="xs" onClose={handleCloseDialog2} open={openDialog2}>
        <DialogTitle onClose={handleCloseDialog2}>{modal.title}</DialogTitle>
        <DialogContent dividers>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="userId"
                  label="Thêm khách mời"
                  name="userId"
                  autoComplete="userId"
                  inputRef={register}
                  error={!!errors.userId}
                  helperText={errors?.userId?.message}
                  value={member.userId}
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
