import React, { useState } from "react";
import {
  FaTruck,
  FaMapMarkedAlt,
  FaWarehouse,
  FaMoneyBillWave,
  FaHandshake,
  FaUndoAlt,
} from "react-icons/fa";

const services = [
  {
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    icon: <FaTruck className="text-5xl text-indigo-500" />,
  },
  {
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    icon: <FaMapMarkedAlt className="text-5xl text-green-600" />,
  },
  {
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    icon: <FaWarehouse className="text-5xl text-orange-500" />,
  },
  {
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    icon: <FaMoneyBillWave className="text-5xl text-emerald-500" />,
  },
  {
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
    icon: <FaHandshake className="text-5xl text-blue-600" />,
  },
  {
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    icon: <FaUndoAlt className="text-5xl text-red-500" />,
  },
];

const Services = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-[#03373D] my-8 py-12 px-4 md:px-16 rounded-3xl text-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Services</h2>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`cursor-pointer rounded-xl p-6 text-gray-800 shadow-md transition hover:scale-[1.02] ${
              activeIndex === index
                ? "bg-primary text-black border-2 border-lime-500"
                : "bg-white"
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="">{service.icon}</div>
              <h3 className="text-xl font-semibold w-2/3">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
