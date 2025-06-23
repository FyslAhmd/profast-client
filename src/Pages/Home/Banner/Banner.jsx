import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import banner1 from "../../../assets/banner/banner1.png";
import banner2 from "../../../assets/banner/banner2.png";
import banner3 from "../../../assets/banner/banner3.png";

const Banner = () => {
  return (
    <Carousel
      className="my-8 rounded-xl overflow-hidden shadow-lg"
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
    >
      <div className="">
        <img
          src={banner1}
          alt="Fast Delivery"
          className="h-[60vh] w-full object-cover"
        />
      </div>

      <div className="relative">
        <img
          src={banner2}
          alt="Tracking"
          className="h-[60vh] w-full object-cover"
        />
      </div>

      <div className="relative">
        <img
          src={banner3}
          alt="Nationwide Delivery"
          className="h-[60vh] w-full object-cover"
        />
      </div>
    </Carousel>
  );
};

export default Banner;
