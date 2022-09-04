import React from "react";
import { useCookies } from "react-cookie";
import { Route, useLocation } from "react-router";
import { Redirect } from "react-router-dom";

const UserAuth = ({ children, ...rest }) => {
  const [cookie] = useCookies(["u_auth"]);
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={() =>
        !cookie.u_auth || location.state === "LOGOUT" ? (
          children
        ) : (
          <Redirect to="/user/my-event" />
        )
      }
    />
  );
};

export default UserAuth;
