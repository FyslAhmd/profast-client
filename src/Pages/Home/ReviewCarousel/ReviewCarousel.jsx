import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import customerTop from "../../../assets/customer-top.png";

const reviews = [
  {
    name: "Sadia Rahman",
    location: "Dhaka",
    description:
      "Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!",
  },
  {
    name: "Tanvir Ahmed",
    location: "Chittagong",
    description:
      "Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!",
  },
  {
    name: "Nusrat Jahan",
    location: "Sylhet",
    description:
      "Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!",
  },
  {
    name: "Fahim Hossain",
    location: "Khulna",
    description:
      "Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!",
  },
  {
    name: "Mehjabin Khan",
    location: "Rajshahi",
    description:
      "Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!,Fast and professional delivery. Great service overall!",
  },
];

const ReviewCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setAnimKey((prev) => prev + 1);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % reviews.length);
    setAnimKey((prev) => prev + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getVisibleReviews = () => {
    const extended = [...reviews, ...reviews];
    return extended.slice(startIndex, startIndex + 3);
  };

  const visibleReviews = getVisibleReviews();

  return (
    <div className="py-10 px-4 bg-transparent text-black">
      <div className="flex items-center justify-center my-8">
        <img src={customerTop} className="" alt="" />
      </div>
      <h2 className="text-3xl font-bold text-center">Customer Reviews</h2>
      <p className="font-medium w-4/6 mx-auto text-center my-8">
        Enhance posture, mobility, and well-being effortlessly with Posture Pro.
        Achieve proper alignment, reduce pain, and strengthen your body with
        ease!
      </p>

      <div className="flex justify-center items-center gap-4 mb-8">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <FaArrowLeft />
        </button>

        <div
          key={animKey}
          className="flex gap-12 w-full justify-center animate-slide-left transition-all duration-500"
        >
          {visibleReviews.map((review, index) => (
            <div
              key={index}
              className={`bg-[url(assets/reviewQuote.png)] bg-no-repeat flex-1 rounded-xl p-6 shadow-md space-y-4 transition-all duration-300 ${
                index === 1
                  ? "bg-white scale-115"
                  : "bg-gray-100 scale-90 opacity-40"
              }`}
            >
              <p className="text-sm">"{review.description}"</p>
              <hr className="border-dashed" />
              <div className="flex gap-6 items-center">
                <div className="h-8 w-8 rounded-full bg-green-800"></div>
                <div>
                  <div className="font-semibold">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ReviewCarousel;
