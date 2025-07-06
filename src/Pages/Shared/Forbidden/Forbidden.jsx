import React from "react";
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className=" min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center animate-fade-in-up">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-4"
          width={90}
          height={90}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d32f2f"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" fill="#fff3f3" />
          <line
            x1="8"
            y1="8"
            x2="16"
            y2="16"
            stroke="#d32f2f"
            strokeWidth="3"
          />
          <line
            x1="16"
            y1="8"
            x2="8"
            y2="16"
            stroke="#d32f2f"
            strokeWidth="3"
          />
        </svg>
        <h1 className="text-5xl font-extrabold text-[#d32f2f] mb-2">403</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Forbidden!</h2>
        <p className="text-gray-700 mb-6">
          Sorry, you don't have permission to access this page.
        </p>
        <Link
          to="/"
          className="btn btn-primary text-black px-8 py-2 rounded-full font-semibold"
        >
          Go to Home
        </Link>
      </div>
      <style>
        {`
          .animate-fade-in-up {
            animation: fadeInUp .7s cubic-bezier(.23,1.02,.45,.98);
          }
          @keyframes fadeInUp {
            from { opacity:0; transform: translateY(40px);}
            to { opacity:1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default Forbidden;
