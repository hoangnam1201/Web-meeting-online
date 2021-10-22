import React from "react";
import "./banner.css";
import imgBanner from "../../../assets/banner.png";
import { Button } from "@material-ui/core";
const Banner = () => {
  return (
    <>
      <section className="main">
        <div className="container">
          <div className="row flex">
            <div className="col-sm-12 col-md-6">
              <h2>Học tập và làm việc trực tuyến</h2>
              <p>Website cung cấp nền tảng làm việc và học tập trực tuyến</p>
              <Button variant="outlined" color="primary">
                Read more
              </Button>
            </div>
            <div className="col-sm-12 col-sm-6">
              <img src={imgBanner} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
