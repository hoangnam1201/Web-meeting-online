import React from "react";
import { Link, useLocation } from "react-router-dom";
import imgLogo from "../../assets/logomeeting.png";

const SiginToContinue = () => {
  const location = useLocation();
  return (
    <div className="h-40 mt-10">
      <div className="w-96 p-4 shadow-xl rounded-lg ml-auto mr-auto">
        <img src={imgLogo} alt="logo" className=" w-32" />
        <p className="text-xl py-4 font-bold text-gray-500">
          Please Sign-in to continue
        </p>
        <div className="flex justify-around mt-4">
          <Link
            to="/"
            className="text-lg font-bold cursor-pointer shadow-md py-1 px-4 text-gray-400 hover:bg-gray-100 rounded-xl"
          >
            Back To Home
          </Link>
          <Link
            to={{ pathname: "/auth/login", state: { targetPath: location.pathname } }}
            className="text-lg font-bold cursor-pointer shadow-md py-1 px-4 text-gray-400 hover:bg-gray-100 rounded-xl"
          >
            Back To Sigin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SiginToContinue;
