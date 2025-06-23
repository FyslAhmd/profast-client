import React from "react";
import Banner from "../Banner/Banner";
import HowItWork from "../HowItWork/HowItWork";
import Services from "../Services/Services";
import SupportedBrand from "../SupportedBrand/SupportedBrand";
import ParcelSteps from "../ParcelSteps/ParcelSteps";
import BeMarchent from "../BeMarchent/BeMarchent";
import ReviewCarousel from "../ReviewCarousel/ReviewCarousel";
import FAQ from "../FAQ/FAQ";

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWork />
      <Services />
      <SupportedBrand />
      <ParcelSteps />
      <BeMarchent />
      <ReviewCarousel />
      <FAQ />
    </div>
  );
};

export default Home;
