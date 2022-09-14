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
} from "@mui/material";
import { withStyles, makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { createTableAPI, updateTableAPI } from "../../api/table.api";
import { useParams } from "react-router-dom";
import {
  getTabelsAction,
  tableSelectFloorAction,
} from "../../store/actions/tableActions";
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
const styles = () => ({
  root: {
    margin: 0,
    padding: "20px",
  },
  closeButton: {
    position: "absolute",
    left: "390px",
    bottom: "280px",
    color: "red",
  },
});
const DialogTitleMui = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle className={classes.root} {...other}>
      <span>{children}</span>
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
  name: yup.string().min(5).required(),
  numberOfSeat: yup.number().min(1).max(8).required(),
});

const CreateDialog = (props) => {
  const classes = useStyles();
  const { openDialog, setOpenDialog, handleCloseDialog, modal } = props;
  const tables = useSelector((state) => state.tables);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [tableError, setTableError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const [tableInfo, setTableInfo] = useState({ ...props?.table });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setTableInfo({
      ...tableInfo,
      [name]: value,
    });
  };

  useEffect(() => {
    setTableInfo(props.table);
  }, [props.table]);

  const onAddSubmit = (data) => {
    setLoading(true);
    const table = {
      ...data,
      room: id,
      floor: tables.currentFloor,
    };
    createTableAPI(table)
      .then(() => {
        setOpenDialog(false);
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Tạo table thành công",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          dispatch(getTabelsAction(id, tables.currentFloor));
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        // setOpenDialog(false);
        if (error?.response?.data?.msg) {
          setTableError(error?.response?.data?.msg);
        }
        if (error?.response?.data?.errors[0].msg) {
          setTableError(error?.response?.data?.errors[0].msg);
        }
        if (error?.response?.data?.err) {
          setTableError(error?.response?.data?.err);
        }
      });
  };

  // const onUpdateSubmit = (data) => {
  //   updateTableAPI(id, data)
  //     .then(() => {
  //       setOpenDialog(false);
  //       Swal.fire({
  //         icon: "success",
  //         title: "Cập nhật thành công",
  //         timer: 1500,
  //         showConfirmButton: false,
  //       }).then(() => {
  //         dispatch(getTabelsAction(id));
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setOpenDialog(false);
  //     });
  // };

  const onCloseHandler = () => {
    reset();
    handleCloseDialog();
  };

  return (
    <div>
      <Dialog maxWidth="xs" open={openDialog}>
        <DialogTitleMui>
          <Grid container>
            <Grid item xs={11}>
              {modal.title}
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={onCloseHandler}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitleMui>
        <DialogContentMui dividers>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  name="name"
                  label="name"
                  inputRef={register}
                  error={!!errors.name}
                  // value={tableInfo?.name}
                  helperText={errors?.name?.message}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="number"
                  name="numberOfSeat"
                  label="number of seats"
                  inputRef={register}
                  error={!!errors.numberOfSeat}
                  helperText={errors?.numberOfSeat?.message}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContentMui>
        <DialogActionsMui>
          {tableError ? (
            <Alert style={{ marginTop: "15px" }} severity="error">
              {tableError}
            </Alert>
          ) : null}
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            type="submit"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={modal.id === "tao" ? handleSubmit(onAddSubmit) : null}
          >
            {modal.button}
          </LoadingButton>
        </DialogActionsMui>
      </Dialog>
    </div>
  );
};

export default CreateDialog;
