import React from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router";
import SigninToContinue from "./../../components/SigninToContinute";

const AdminAuth = ({ children, ...rest }) => {
  const [cookie] = useCookies(["u_auth"]);
  const user = useSelector((state) => state.userReducer);
  return (
    <Route
      {...rest}
      render={() =>
        cookie.u_auth ? (
          (user?.user?.role === "ADMIN" || !user.user) ? (
            children
          ) : (
            <Redirect to="/user/my-event" />
          )
        ) : (
          <SigninToContinue />
        )
      }
    />
  );
};

export default AdminAuth;
