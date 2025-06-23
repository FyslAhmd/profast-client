import React from "react";
import Marquee from "react-fast-marquee";
import brand1 from "../../../assets/brands/amazon.png";
import brand2 from "../../../assets/brands/amazon_vector.png";
import brand3 from "../../../assets/brands/casio.png";
import brand4 from "../../../assets/brands/moonstar.png";
import brand5 from "../../../assets/brands/randstad.png";
import brand6 from "../../../assets/brands/start-people 1.png";
import brand7 from "../../../assets/brands/start.png";

const brands = [brand1, brand2, brand3, brand4, brand5, brand6, brand7];

const SupportedBrand = () => {
  return (
    <div className="py-6 my-8">
      <h2 className="text-3xl font-extrabold text-center mb-8">
        We've helped thousands of sales teams
      </h2>
      <Marquee gradient={false} speed={50} pauseOnHover={true} direction="left">
        {brands.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`brand-${index}`}
            className="h-6 mx-16 w-auto object-contain"
          />
        ))}
      </Marquee>
    </div>
  );
};

export default SupportedBrand;
