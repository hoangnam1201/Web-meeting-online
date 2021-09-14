import React from "react";
import { Route } from "react-router";
import Header from "./Header";

const LayoutHome = (props) => {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
};

const Home = (props) => {
  return (
    <LayoutHome>
      <Route
        exact={props.exact}
        path={props.path}
        component={props.component}
      />
    </LayoutHome>
  );
};

export default Home;
