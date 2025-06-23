import React from "react";
import delivartLogo from "../../../assets/bookingIcon.png";

const HowItWork = () => {
  const bookingInfo = [
    {
      title: "Booking Pick & Drop",
      description:
        "Easily schedule a pickup and drop-off for your packages from home or office.",
    },
    {
      title: "Cash On Delivery",
      description:
        "Let your customers pay upon delivery — we collect and deliver with care.",
    },
    {
      title: "Delivery Hub",
      description:
        "Access our local delivery hubs for faster, more flexible courier options.",
    },
    {
      title: "Booking SME & Corporate",
      description:
        "Tailored logistics solutions for small businesses and corporate clients.",
    },
  ];

  return (
    <div className="my-12">
      <h1 className="font-extrabold text-3xl mb-4">How it Works</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
        {bookingInfo.map((info, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 space-y-4">
            <img src={delivartLogo} alt="" />
            <h3 className="text-xl font-bold">{info.title}</h3>
            <p className="font-medium">{info.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWork;
