import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import imgLogo from "../../../assets/logomeeting.png";
import Avatar from "react-avatar";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { getInfoAPI } from "../../../api/user.api";
import { useDispatch } from "react-redux";
import {
  actionRemoveUserInfo,
  actionSetUserInfo,
} from '../../../store/actions/userInfoAction';

//type: 0-unlogin 1-logged
const Header = React.memo(({ type = 0, ...rest }) => {
  const currentUser = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["u_auth"]);

  useEffect(() => {
    if (type === 1 && currentUser) {
      if (!currentUser?.user) {
        getInfoAPI().then((res) => {
          dispatch(actionSetUserInfo(res.data));
        });
      }
    }
  }, [type]);

  const handleLogout = () => {
    removeCookies("u_auth");
    dispatch(actionRemoveUserInfo());
    Swal.fire({
      icon: "success",
      title: "Đăng xuất thành công",
      text: "Cảm ơn bạn đã sử dụng UTE Meeting",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div {...rest}>
      <section id="header" className="shadow-lg">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container flex justify-between items-center">
              <Link to="/" className="navbar-brand">
                <img width="150" height="100" src={imgLogo} alt="" />
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
                      <Link className="nav-link" to="/user/my-event">
                        My Event
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              {type === 1 ? (
                <div className="collapse navbar-collapse mr-10">
                  <div className="relative">
                    <Avatar
                      name={currentUser?.user?.name}
                      size="50"
                      round={true}
                      className="cursor-pointer"
                      onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                    ></Avatar>
                    {showAvatarMenu && (
                      <div className="absolute z-30 mt-2 bg-pink-50 rounded-lg shadow-lg w-40 left-1/2 transform -translate-x-1/2">
                        <ul className="p-1">
                          <li className="font-bold text-gray-500 border-b-2 p-3">
                            {currentUser?.user?.name}
                          </li>
                          <li className="py-3 font-medium hover:bg-pink-100 text-gray-500">
                            <Link underline="none" to="/user/profile">
                              Thông tin cá nhân
                            </Link>
                          </li>
                          <li className="py-3 font-medium hover:bg-pink-100 text-gray-500">
                            <Link
                              underline="none"
                              to="/"
                              onClick={handleLogout}
                            >
                              Đăng xuất
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="collapse navbar-collapse mr-10">
                  <ul className="navbar-nav ml-auto flex justify-center">
                    <li className="nav-item active">
                      <Link className="nav-link" to="/auth/login">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item ">
                      <Link className="nav-link" to="/auth/register">
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
    </div>
  );
});

export default Header;
