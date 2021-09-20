import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import imgLogo from "../../../assets/logomeeting.png";
const Header = () => {
  return (
    <>
      <section id="header">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container flex justify-between items-center">
              <Link to="/" className="navbar-brand">
                <img width="200" height="200" src={imgLogo} alt="" />
              </Link>
              <div
                className="collapse navbar-collapse"
                id="navbarSuportedContent"
              >
                <ul className="navbar-nav ml-auto flex justify-center">
                  <li className="nav-item active">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item ">
                    <Link className="nav-link" to="/">
                      Service
                    </Link>
                  </li>
                  <li className="nav-item ">
                    <Link className="nav-link" to="/">
                      About
                    </Link>
                  </li>
                  <li className="nav-item ">
                    <Link className="nav-link" to="/">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav ml-auto flex justify-center">
                  <li className="nav-item active">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item ">
                    <Link className="nav-link" to="/register">
                      SignUp
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </>
  );
};

export default Header;
