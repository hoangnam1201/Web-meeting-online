import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./header.css";
import imgLogo from "../../../assets/logomeeting.png";
import Avatar from "react-avatar";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { getInfoAPI, logoutAPI } from "../../../api/user.api";
import { useDispatch } from "react-redux";
import {
  actionRemoveUserInfo, getUserInfo,
} from "../../../store/actions/userInfoAction";
import Scroll from "react-scroll";
import { CircularProgress } from "@mui/material";

//type: 0-unlogin 1-logged
const Header = React.memo(({ type = 0, ...rest }) => {
  const currentUser = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["u_auth"]);
  const history = useHistory();
  let LinkScroll = Scroll.Link;

  useEffect(() => {
    if (type === 1 && currentUser) {
      if (!currentUser?.user) {
        dispatch(getUserInfo());
      }
    }
  }, [type]);

  const handleLogout = () => {
    logoutAPI().then(() => {
      dispatch(actionRemoveUserInfo());
      removeCookies("u_auth", { path: "/" });
      history.push("/auth/login");
      Swal.fire({
        icon: "success",
        title: "Logout successfull !!",
        text: "Thank you for using UTE Meeting",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  };

  return (
    <div>
      <section id="header" className="shadow-sm relative z-30">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container flex justify-between items-center">
              <Link to="/" className="navbar-brand min-w-max">
                <img
                  width="150"
                  height="100"
                  src={imgLogo}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div
                className="collapse navbar-collapse mr-10"
                id="navbarSuportedContent"
              >
                {type === 0 ? (
                  <ul className="navbar-nav ml-auto flex justify-center">
                    <li className="nav-item active">
                      <Link className="nav-link" to="/">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <LinkScroll className="nav-link" to="service">
                        Service
                      </LinkScroll>
                    </li>
                    <li className="nav-item ">
                      <LinkScroll className="nav-link" to="about">
                        About
                      </LinkScroll>
                    </li>
                    <li className="nav-item ">
                      <LinkScroll className="nav-link" to="contact">
                        Contact
                      </LinkScroll>
                    </li>
                  </ul>
                ) : (
                  <ul>
                    <li className="nav-item active">
                      <Link className="nav-link" to="/user/my-event">
                        My Event
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              {type === 1 ? (
                <div className="collapse navbar-collapse mr-10">
                  <div
                    className="relative p-2"
                    onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  >
                    {currentUser?.loading && <div>
                      <CircularProgress size='3rem' />
                    </div>}
                    {!currentUser?.loading && (currentUser?.user?.picture ? (
                      <img
                        src={currentUser?.user?.picture}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="cursor-pointer rounded-full w-12"
                      ></img>
                    ) : (
                      <Avatar
                        name={currentUser?.user?.name}
                        size="50"
                        round={true}
                        className="cursor-pointer"
                      ></Avatar>
                    ))}

                    {showAvatarMenu && (
                      <div className="absolute z-30 mt-2 bg-pink-50 rounded-lg shadow-lg w-40 left-1/2 transform -translate-x-1/2">
                        <ul className="p-1">
                          <li className="font-bold text-gray-500 border-b-2 p-3">
                            {currentUser?.user?.name}
                          </li>
                          <li className="py-3 font-medium hover:bg-pink-100 text-gray-500">
                            <Link underline="none" to="/user/profile">
                              Profile
                            </Link>
                          </li>
                          <li className="py-3 font-medium hover:bg-pink-100 text-gray-500">
                            <button onClick={handleLogout}>Log out</button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="collapse navbar-collapse mr-10 flex min-w-min items-center justify-center">
                  <Link to="/auth/login">
                    <button
                      variant="outlined"
                      className="mr-10 py-2 px-5 rounded text-stone-500 bg-stone-50 shadow hover:bg-stone-200 whitespace-nowrap"
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link to="/auth/register">
                    <button
                      variant="outlined"
                      className="py-2 px-5 rounded bg-stone-400 hover:bg-stone-500 text-white shadow whitespace-nowrap"
                    >
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
});

export default Header;
