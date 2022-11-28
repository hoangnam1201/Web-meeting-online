import React from "react";
import imgBanner from "../../../assets/banner.png";
import imgBanner1 from "../../../assets/meetingslide.jpg";
import imgBanner2 from "../../../assets/meetingslide1.jpg";
import imgBanner3 from "../../../assets/meetingslide2.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import { Button } from "@mui/material";

const Banner = () => {
  SwiperCore.use([Autoplay]);
  return (
    <>
      <div className="flex justify-center items-center bg-orange-50 relative py-12 z-30">
        <div className="flex flex-col justify-center items-center text-black md:mr-32 md:mb-14">
          <h2 className="font-bold text-4xl">Study, Metting Online</h2>
          <p className="pt-5 pb-1">We provide an online meeting support platform</p>
          <p className="py-5 pt-1">Support Divide The Room Into Small Groups</p>
          <Button
            className="w-32 text-black border-2"
            variant="outlined"
            color="primary"
          >
            Read more
          </Button>
        </div>
        <div className="hidden md:block col-sm-12 col-sm-6 w-1/2">
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
