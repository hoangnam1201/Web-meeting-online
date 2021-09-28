import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { makeStyles } from "@material-ui/core";
import { Button } from "@mui/material";
import ChairTwoToneIcon from "@mui/icons-material/ChairTwoTone";
import IconButton from "@mui/material/IconButton";
import ToolBar from "./toolbar";

const useStyles = makeStyles({
  root: {
    padding: "25px 15px",
    border: "1px solid gray",
    boxShadow: "5px 5px 5px 5px",
    marginBottom: "50px",
  },
  container: {
    background: "gray",
  },
  table: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid black",
    columnCount: "2",
    backgroundImage: `url("https://gachmenlinhphuong.com/wp-content/uploads/2019/06/G%E1%BA%A1ch-l%C3%A1t-n%E1%BB%81n-nh%C3%A0-lp56.jpg")`,
  },
  chair: {
    margin: "10px 10px",
    width: "100px",
    height: "100px",
    textDecoration: "none",
    textAlign: "center",
  },
  toolBar: {
    position: "sticky",
    position: "-webkit-sticky",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9990",
    bottom: "10px",
  },
});
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const RoomDetail = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Box className={classes.root} sx={{ width: "100%" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Item className={classes.table}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item className={classes.table}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <IconButton
                    color="warning"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="warning"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="warning"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="warning"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item className={classes.table}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item className={classes.table}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <IconButton
                    color="secondary"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="secondary"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="secondary"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    color="secondary"
                    aria-label="upload picture"
                    component="span"
                    className={classes.chair}
                  >
                    <ChairTwoToneIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <div className={classes.toolBar}>
        <ToolBar />
      </div>
    </div>
  );
};

export default RoomDetail;
