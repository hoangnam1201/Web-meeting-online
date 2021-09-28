import React from "react";
import { Route } from "react-router";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";
import { useEffect } from "react";
const LayoutHome = (props) => {
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const getInfoUser = async () => {
    try {
      const fetch = {
        url: "http://localhost:3002/api/user/get-detail",
        method: "GET",
        headers: {
          Authorization: `token ${accessToken.accessToken}`,
        },
      };
      const res = await axios(fetch);
      localStorage.setItem("loginInfo", JSON.stringify(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getInfoUser();
  }, [getInfoUser]);
  return (
    <>
      <Header />
      {props.children}
      {accessToken ? "" : <Footer />}
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
