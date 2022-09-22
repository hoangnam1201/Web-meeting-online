import React from "react";
import Header from "../components/HomePage/Header";

const DefautLayout = ({ children, logged }) => {
  return (
    <div>
      <Header type={logged ? 1 : 0}/>
      {children}
    </div>
  );
};

export default DefautLayout;
