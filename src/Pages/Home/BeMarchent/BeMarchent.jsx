import React from "react";
import locationMarchent from "../../../assets/location-merchant.png";

const BeMarchent = () => {
  return (
    <div
      data-aos="zoom-in-up"
      className="bg-[url(assets/be-a-merchant-bg.png)] bg-no-repeat bg-[#03373D] p-20 my-8 rounded-4xl"
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={locationMarchent} className="max-w-sm" />
        <div className="space-y-5">
          <h1 className="text-white text-4xl font-extrabold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="text-gray-200 w-5/6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className="flex gap-4 items-center">
            <button className="btn bg-primary text-xl font-bold rounded-full">
              Become a Merchant
            </button>
            <button className="btn bg-transparent text-primary text-xl border-primary font-bold rounded-full">
              Earn with Profast Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMarchent;
