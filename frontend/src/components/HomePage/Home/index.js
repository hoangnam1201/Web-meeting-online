import React from "react";
import Banner from "../Banner";
import { Helmet } from "react-helmet";
import MainPage from "../MainPage";
const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>UTE Meeting - Trang chủ</title>
        <meta charSet="utf-8" name="description" content="Trang chủ" />
      </Helmet>
      <Banner />
      <MainPage />
    </>
  );
};

export default HomePage;
