import React from "react";
import image1 from "../../../assets/TransitWarehouse.png";
import image2 from "../../../assets/Group4.png";

const ParcelSteps = () => {
  const data = [
    {
      image: image1,
      title: "Live Parcel Tracking",
      description:
        "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    },
    {
      image: image2,
      title: "100% Safe Delivery",
      description:
        "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    },
    {
      image: image2,
      title: "24/7 Call Center Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    },
  ];
  return (
      <div className="space-y-4 my-8">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-xl flex flex-col md:flex-row items-center gap-10 p-4">
            <img src={item.image} className="w-12 md:w-44" alt="" />
            <div className="divider divider-horizontal my-6 hidden md:block"></div>
            <div className="space-y-6">
              <h1 className="text-2xl font-extrabold">{item.title}</h1>
              <p className="font-medium">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
  );
};

export default ParcelSteps;
