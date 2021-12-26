import React from "react";
import { Route } from "react-router";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
const LayoutHome = (props) => {
  const [cookies] = useCookies(['u_auth'])

  return (
    <>
      <Header />
      {props.children}
      <Footer />
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
