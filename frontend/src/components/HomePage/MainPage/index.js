import React from "react";
import iconCheck from "../../../assets/iconcheck.png";
import Button from "@mui/material/Button";
import imgMeeting from "../../../assets/imagemeeting.png";
import Footer from "../Footer";
import Table7 from "../../roomCall/tables/table7";
import Table4 from "../../roomCall/tables/table4";
import Table2 from "../../roomCall/tables/table2";
import Table3 from "../../roomCall/tables/table3";
import { Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  root: {
    background: "#fff7ed",
    paddingTop: "10px",
    color: "black",
    borderBottom: "1px solid white",
  },
  textIntro: {
    paddingTop: "10px",
    display: "flex",
    justifyContent: "center",
    paddingBottom: "25px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "30px",
    color: "black",
  },
  title2: {
    fontWeight: "bold",
    fontSize: "20px",
  },
  textContent: {
    display: "block",
    textAlign: "left",
    lineHeight: "40px",
  },
  groupText: {
    display: "flex",
  },
  container2: {
    marginTop: "15px",
    background: "#ffffff",
    color: "black",
  },
  ul: {
    listStyleType: "square",
    paddingLeft: "30px",
  },
});
const MainPage = () => {
  const classes = useStyles();
  return (
    <>
      <div className="flex justify-center bg-white">
        <div className="p-5">
          <h1 className=" text-4xl font-bold text-stone-500 tracking-wider py-4">
            Beautiful Interface & Call With Table Group
          </h1>
          <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
            <Table7 className="hidden md:block h-full col-span-2" />
            <Table2 className="hidden md:block h-full w-56" />
            <Table3 className="hidden md:block h-full" />
            <Table4 className="h-full" />
          </div>
        </div>
      </div>
      <div className="overflow-hidden bg-orange-50">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 144"
          preserveAspectRatio="none"
          className="w-full h-36"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill fill-white"
          ></path>
        </svg>
      </div>
      <Container
        id="service"
        className={classes.root}
        component="div"
        maxWidth={false}
      >
        <h1 className={classes.title}>Set up for modern groups</h1>
        <Grid
          container
          spacing={4}
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={classes.textIntro}
        >
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="100" height="100" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Video and Audio HD</h4>
              <p>
                Bring video and audio to your meeting with up support up to 100
                video participants and 10 on-screen videos.
              </p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="100" height="100" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Built-in collaboration tools</h4>
              <p>
                Multiple participants can simultaneously share their screen and
                co-annotate a meeting with more engagement.
              </p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="100" height="100" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>For Connections</h4>
              <p>
                Filters, emotions, polls, raise your hand, and share music or
                video makes meetings more interesting and engaging.
              </p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="75" height="75" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Record and transcipt</h4>
              <p>
                Record your meetings to your device or in the cloud, with copy
                easy search.
              </p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="50" height="50" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Science calendar</h4>
              <p>Support to schedule or start a meeting from Outlook, Gmail</p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="125" height="125" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Group Chat</h4>
              <p>
                Group chat, easy search history, file sharing integrated and
                stored for 1 years. Upgrade easily from call one-to-one or group
                call.
              </p>
            </div>
          </Grid>
        </Grid>
      </Container>
      <div className="overflow-hidden bg-white">
        <svg
          data-v-6da3ec0c=""
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 144"
          preserveAspectRatio="none"
          className="w-full h-36"
        >
          <path
            data-v-6da3ec0c=""
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill fill-orange-50"
          ></path>
        </svg>
      </div>
      <Container
        id="about"
        className={classes.container2}
        component="div"
        maxWidth={false}
      >
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <img width="500" height="500" src={imgMeeting} alt="meet" />
          </Grid>
          <Grid item md={6} xs={12}>
            <div className={classes.textContent}>
              <h2 className={classes.title2}>UTE Meeting</h2>
              <p>
                Get all Meetings, Phone and Chat services on any device bag.
              </p>
              <ul className={classes.ul}>
                <li>
                  Upgrade a conversation or phone call to a call one-click
                  meeting
                </li>
                <li>
                  Enjoy industry-leading services with quality video and audio
                  tallest
                </li>
                <li>
                  Applications are provided on Windows, MacOS, Linux platforms
                  as well as iOS and Android OS
                </li>
              </ul>
              <Button className="text-sm" variant="contained" color="warning">
                Start using the service today
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default MainPage;
