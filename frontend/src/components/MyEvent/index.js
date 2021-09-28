import React from "react";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Container, Grid } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ImgMeeting from "../../assets/meeting.jpg";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
const useStyles = makeStyles({
  root: {
    padding: "40px 0",
    margin: "5px 10px",
  },
  title: {
    display: "inline-block",

    fontSize: "24px",
    marginBottom: "20px",

    position: "relative",
    "&::after": {
      position: "absolute",
      display: "block",
      content: "''",

      bottom: "-5px",
      left: "0",

      height: "2px",
      width: "120%",

      backgroundColor: "#0E1E40",
    },
  },
  courseListContainer: {
    marginTop: "10px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  date: {
    fontWeight: "bold",
  },
});
const MyEvent = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Helmet>
        <title>My Event</title>
        <meta charSet="utf-8" name="description" content="Home" />
      </Helmet>
      <section>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EventNoteIcon />}
        >
          New Events
        </Button>
        <Container component="div" maxWidth="lg">
          <Grid container>
            <Grid item>
              <Typography
                variant="h2"
                color="primary"
                component="p"
                className={classes.title}
              >
                My Event
              </Typography>
            </Grid>
          </Grid>

          <div>
            <Grid container spacing={4} className={classes.courseListContainer}>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Card sx={{ maxWidth: 345 }}>
                  <Link to="/room-detail">
                    <CardMedia
                      component="img"
                      height="140"
                      image={ImgMeeting}
                      alt="green iguana"
                    />
                  </Link>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="div">
                      Họp nhóm TLCN
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Họp nhóm báo cáo về tính hình làm việc tuần vừa qua
                    </Typography>
                    <Typography
                      className={classes.date}
                      variant="body2"
                      color="text.secondary"
                    >
                      Bắt đầu: 26/09/2021 7:00PM
                    </Typography>
                    <Typography
                      className={classes.date}
                      variant="body2"
                      color="text.secondary"
                    >
                      Kết thúc: 26/09/2021 11:50 PM
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<PersonIcon />}>
                      0/50
                    </Button>
                    <Button size="small">0 sponsor</Button>
                    <Button size="small">1 floor</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={ImgMeeting}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with
                      over 6,000 species, ranging across all continents except
                      Antarctica
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={ImgMeeting}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with
                      over 6,000 species, ranging across all continents except
                      Antarctica
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={ImgMeeting}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with
                      over 6,000 species, ranging across all continents except
                      Antarctica
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default MyEvent;
