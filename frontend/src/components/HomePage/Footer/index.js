import { Container, Grid, Link } from "@material-ui/core";
import React from "react";
import Logo from "../../../assets/logomeeting.png";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import { makeStyles } from "@material-ui/core/styles";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: "30px",
  },
  root: {
    boxShadow: "0 0 10px rgb(0 0 0 / 30%)",
    background: "#001933",
    color: "#E0E0E0",
    paddingTop: "10px",
  },
  container: {
    marginBottom: "30px",
  },
  linkList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  link: {
    marginTop: "15px",
    color: "#E0E0E0",
  },
  copyright: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0e1e40",
  },
  info: {
    display: "flex",
    alignItems: "center",
    "&:nth-of-type(1)": {
      marginBottom: "5px",
    },
  },
  icon: {
    marginRight: "5px",
  },
}));
export default function Footer() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <Container className={classes.container}>
          <Grid container spacing={4} className={classes.grid}>
            <Grid item xs={12} sm={2} className={classes.infoList}>
              <img src={Logo} width="100" height="100" />
              <div className={classes.info}>
                <PhoneIcon className={classes.icon} />
                <span>0123456789</span>
              </div>
              <div className={classes.info}>
                <EmailIcon className={classes.icon} />
                <span>utemeeting@gmail.com</span>
              </div>
              <div className={classes.info}>
                <FacebookIcon className={classes.icon} />
                <span>hoangnam12</span>
              </div>
              <div className={classes.info}>
                <YouTubeIcon className={classes.icon} />
                <span>utechannel</span>
              </div>
            </Grid>
            <Grid item xs={6} sm={2} className={classes.linkList}>
              <Link className={classes.link} underline="none" href="#">
                PRICING
              </Link>
              <Link className={classes.link} underline="none" href="#">
                BLOG
              </Link>
              <Link className={classes.link} underline="none" href="#">
                LIÊN HỆ
              </Link>
              <Link className={classes.link} underline="none" href="#">
                VỀ CHÚNG TÔI
              </Link>
            </Grid>
            <Grid item xs={6} sm={2} className={classes.linkList}>
              <Link className={classes.link} underline="none" href="#">
                PRIVACY
              </Link>
              <Link className={classes.link} underline="none" href="#">
                DATA PROTECTION
              </Link>
              <Link className={classes.link} underline="none" href="#">
                COOKIE NOTICE
              </Link>
              <Link className={classes.link} underline="none" href="#">
                USER TEMS OF SERVICE
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.desc}>
              <h2>UTE MEETING</h2>
              <p>
                Nền tảng học tập, làm việc trực tuyến trong thời kỳ COVID-19
              </p>
              <p>Mang tri thức và sức mạnh đẩy lùi dịch bệnh</p>
              <p>
                Địa chỉ: 1 Võ Văn Ngân, phường Linh Chiểu, TP Thủ Đức, TPHCM
              </p>
            </Grid>
          </Grid>
        </Container>
        <div className={classes.copyright}>
          <p>Copyright UTE MEETING © 2021</p>
        </div>
      </div>
    </>
  );
}
