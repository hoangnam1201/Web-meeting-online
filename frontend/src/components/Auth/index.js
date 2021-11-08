import React from "react";
import { Route } from "react-router";

const LayoutAuth = (props) => {
  return <>{props.children}</>;
};

const Auth = (props) => {
  return (
    <LayoutAuth>
      <Route
        exact={props.exact}
        path={props.path}
        component={props.component}
      />
    </LayoutAuth>
  );
};

export default Auth;
