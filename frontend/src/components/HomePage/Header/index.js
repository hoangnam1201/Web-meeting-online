import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import imgLogo from "../../../assets/logomeeting.png";
import Avatar from "react-avatar";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { logoutAPI } from "../../../api/user.api";
import { useDispatch } from "react-redux";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  actionRemoveUserInfo,
  getUserInfo,
} from "../../../store/actions/userInfoAction";
import Scroll from "react-scroll";
import { Button, CircularProgress, IconButton } from "@mui/material";

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
      <section id="header" className={`shadow relative z-40 ${type === 0 ? 'bg-pink-50' : 'bg-gray-50'} py-1`}>
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="flex justify-between items-center">
              <Link to="/" className="navbar-brand min-w-max md:ml-5">
                <img
                  width="150"
                  height="100"
                  src={imgLogo}
                  alt=""
                  className="bg-white rounded-full"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div >
                {type === 0 ? (
                  <ul className="flex justify-center gap-5">
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
                    <li>
                      <Link to="/user/my-event">
                        <button className=" outline-none bg-white rounded-full py-1 px-4 text-sm text-blue-600">
                          MY EVENT
                        </button>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              {type === 1 ? (
                <div className="mr-10">
                  <div
                    className="relative p-2"
                  >
                    {currentUser?.loading && (
                      <div>
                        <CircularProgress size="3rem" />
                      </div>
                    )}
                    <Button endIcon={
                      <AccountCircleIcon fontSize="large"
                        className=" text-gray-400"
                      />
                    }
                      onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                    >
                      account
                    </Button>

                    {showAvatarMenu && (
                      <React.Fragment>
                        <div className="fixed top-0 left-0 w-full h-full z-20"
                          onClick={() => setShowAvatarMenu(false)}
                        ></div>
                        <div className="absolute z-30 mt-2 bg-gray-50 rounded-lg shadow-lg w-40 left-full transform -translate-x-full">
                          <ul className="p-1">
                            <li className="font-bold text-gray-500 border-b-2 p-3 overflow-hidden text-ellipsis flex gap-2 justify-center items-center">
                              <div className="min-w-max">
                                {(currentUser?.user?.picture ? (
                                  <img
                                    src={currentUser?.user?.picture}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                    className="cursor-pointer rounded-full w-9"
                                  ></img>
                                ) : (
                                  <Avatar
                                    name={currentUser?.user?.name}
                                    size="36"
                                    round={true}
                                    className="cursor-pointer"
                                  ></Avatar>
                                ))}</div>
                              <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                                {currentUser?.user?.name}
                              </p>
                            </li>
                            {currentUser?.user?.role === "ADMIN" && (
                              <li className="py-3 font-medium hover:bg-gray-100 text-gray-500">
                                <Link underline="none" to="/admin">
                                  Admin dashboard
                                </Link>
                              </li>
                            )}
                            <li className="py-3 font-medium hover:bg-gray-100 text-gray-500">
                              <Link underline="none" to="/user/profile">
                                Profile
                              </Link>
                            </li>
                            <li className="py-3 font-medium hover:bg-gray-100 text-gray-500">
                              <button onClick={handleLogout}>Log out</button>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mr-10 flex min-w-min items-center justify-center">
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
