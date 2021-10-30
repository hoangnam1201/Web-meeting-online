import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import imgLogo from "../../../assets/logomeeting.png";
import { Avatar, Typography } from "@material-ui/core";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";

const randomColor = () => {
  let hex = Math.floor(Math.random() * 0xffffff);
  let color = "#" + hex.toString(16);

  return color;
};
const useStyles = makeStyles((theme) => ({
  avatarMenu: {
    display: "flex",
    flexDirection: "column",
    listStyle: "none",
    padding: "0 15px",
    "& $li:not(:first-child)": {
      paddingTop: "15px",
    },
  },
  avatarName: {
    color: "#fff",
    fontWeight: "bold",
  },
  avatar: {
    marginLeft: "50px",
    textTransform: "uppercase",
    backgroundColor: randomColor(),
    cursor: "pointer",
  },
  avatarMenuContainer: {
    position: "absolute",
    top: "90%",
    left: "80%",
    backgroundColor: "#0e1e40",
    zIndex: "20",
    display: "none",
  },
  avatarLink: {
    color: "white",
    marginLeft: 0,
    textDecoration: "none",
  },
  isShowAvatarMenu: {
    display: "block",
  },
}));
const Header = () => {
  const classes = useStyles();
  // const [showMenu, setShowMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  // const classMenuResult = showMenu ? classes.show : "";
  const classAvatarMenuResult = showAvatarMenu ? classes.isShowAvatarMenu : "";
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const infoUser = localStorage
    ? JSON.parse(localStorage.getItem("loginInfo"))
    : "";
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginInfo");
    Swal.fire({
      icon: "success",
      title: "Đăng xuất thành công",
      text: "Cảm ơn bạn đã sử dụng UTE Meeting",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <>
      <section id="header">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container flex justify-between items-center">
              {loginInfo ? (
                <Link to="/my-event" className="navbar-brand">
                  <img width="200" height="200" src={imgLogo} alt="" />
                </Link>
              ) : (
                <Link to="/" className="navbar-brand">
                  <img width="200" height="200" src={imgLogo} alt="" />
                </Link>
              )}
              <div
                className="collapse navbar-collapse mr-10"
                id="navbarSuportedContent"
              >
                {!loginInfo ? (
                  <ul className="navbar-nav ml-auto flex justify-center">
                    <li className="nav-item active">
                      <Link className="nav-link" to="/">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item ">
                      <Link className="nav-link" to="/">
                        Service
                      </Link>
                    </li>
                    <li className="nav-item ">
                      <Link className="nav-link" to="/">
                        About
                      </Link>
                    </li>
                    <li className="nav-item ">
                      <Link className="nav-link" to="/">
                        Contact
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <ul>
                    <li className="nav-item active">
                      <Link className="nav-link" to="/my-event">
                        My Event
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              {loginInfo ? (
                <div className="collapse navbar-collapse mr-10">
                  <Avatar
                    className={classes.avatar}
                    onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  >
                    {infoUser?.username.charAt(0)}
                  </Avatar>
                  <div
                    className={
                      classes.avatarMenuContainer + " " + classAvatarMenuResult
                    }
                  >
                    <ul className={classes.avatarMenu}>
                      <li>
                        <Typography
                          className={classes.avatarName}
                          noWrap="true"
                          variant="body2"
                          component="span"
                        >
                          Tên user
                        </Typography>
                      </li>
                      <li>
                        <Link
                          underline="none"
                          className={classes.avatarLink}
                          to="/profile"
                        >
                          Thông tin cá nhân
                        </Link>
                      </li>

                      <li>
                        <Link
                          underline="none"
                          className={classes.avatarLink}
                          to="/"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="collapse navbar-collapse mr-10">
                  <ul className="navbar-nav ml-auto flex justify-center">
                    <li className="nav-item active">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item ">
                      <Link className="nav-link" to="/register">
                        SignUp
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>
      </section>
    </>
  );
};

export default Header;
