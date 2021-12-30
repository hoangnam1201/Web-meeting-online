import React from "react";
import Header from "../components/HomePage/Header";

const DefautLayout = ({ children, logged }) => {
  return (
    <div>
      <Header type={logged ? 1 : 0} className="z-30 relative" />
      {children}
    </div>
  );
};

export default DefautLayout;
