import React from "react";
import { Route } from "react-router";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
const LayoutHome = (props) => {
  const [cookies] = useCookies(['u_auth'])
  const getInfoUser = async () => {
    try {
      const fetch = {
        url: "http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/user/get-detail",
        method: "GET",
        headers: {
          Authorization: `token ${cookies.u_auth.accessToken}`,
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
