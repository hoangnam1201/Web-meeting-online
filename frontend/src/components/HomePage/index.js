import React from "react";
import { Route } from "react-router";


const LayoutHome = (props) => {
  return (
    <>
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
