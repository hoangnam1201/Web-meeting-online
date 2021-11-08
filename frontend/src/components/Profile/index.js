import React from "react";
import { NavLink } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ChangePassword from "./changepassword";
import Profiles from "./profile";
import { makeStyles, Container } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    marginBottom: "100px",
  },
  navbar: {
    background: "#FF6666",
    height: "50px",
    marginBottom: "30px",
  },
  linkli: {
    listStyle: "none",
    margin: "15px 10px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "large",
    fontWeight: "bold",
    "&:hover": {
      color: "#1645ab",
    },
  },
  ull: {
    display: "flex",
    alignItems: "center",
  },
});
const Profile = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <nav className={classes.navbar}>
        <Container>
          <ul className={classes.ull}>
            <li className={classes.linkli}>
              <NavLink
                activeStyle={{ color: "#1645ab", fontWeight: "bold" }}
                className={classes.link}
                to="/user/profile/change-profile"
              >
                Hồ sơ cá nhân
              </NavLink>
            </li>

            <li className={classes.linkli}>
              <NavLink
                activeStyle={{ color: "#1645ab", fontWeight: "bold" }}
                className={classes.link}
                to="/user/profile/change-password"
              >
                Thay đổi mật khẩu
              </NavLink>
            </li>
          </ul>
        </Container>
      </nav>
      <Switch>
        <Route path="/user/profile/change-profile" component={Profiles} />
        <Route path="/user/profile/change-password" component={ChangePassword} />
      </Switch>
    </div>
  );
};
export default Profile;
