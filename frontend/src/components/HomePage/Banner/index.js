import React from "react";
import imgBanner from "../../../assets/banner.png";
import imgBanner1 from "../../../assets/meetingslide.jpg";
import imgBanner2 from "../../../assets/meetingslide1.jpg";
import imgBanner3 from "../../../assets/meetingslide2.png";
import Button from "@material-ui/core/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import SwiperCore, { Autoplay, Pagination } from "swiper";

const Banner = () => {
  SwiperCore.use([Autoplay]);
  return (
    <>
      <div className="flex justify-center items-center bg-blue-dark relative py-12 rounded-b-4xl z-30">
        <div className="flex flex-col justify-center items-center text-black mr-32 mb-14">
          <h2 className="font-bold text-4xl">Học tập và làm việc trực tuyến</h2>
          <p className="py-10">
            Website cung cấp nền tảng làm việc và học tập trực tuyến
          </p>
          <Button
            className="w-32 text-black border-2"
            variant="outlined"
            color="primary"
          >
            Read more
          </Button>
        </div>
        <div className="col-sm-12 col-sm-6 w-1/2">
          {/* <div className="w-1/2 h-1/2 border-8 border-white">
            <img src={imgBanner1} alt="" />
          </div>
          <div className="w-1/2 h-1/2 border-8 border-white">
            <img src={imgBanner2} alt="" />
          </div> */}
          <Swiper
            spaceBetween={10}
            autoplay={{
              delay: 5000,
            }}
            loop={true}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
          >
            <SwiperSlide>
              <img src={imgBanner3} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={imgBanner} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={imgBanner1} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="w-3/4" src={imgBanner2} alt="" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Banner;
