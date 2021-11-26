import React from "react";
import Header from "../components/HomePage/Header";
import Footer from "../components/HomePage/Footer";

const DefautLayout = ({ children, logged }) => {
  return (
    <div>
      <Header type={logged ? 1 : 0} className="z-30 relative" />
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default DefautLayout;
