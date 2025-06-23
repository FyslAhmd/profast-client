import React from "react";

const FAQ = () => {
  return (
    <div className="w-full space-y-6 my-8">
      <h1 className="text-4xl text-center font-extrabold">
        Frequently Asked Question (FAQ)
      </h1>
      <p className="text-center w-4/6 mx-auto">Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!</p>
      <div className="collapse collapse-arrow border border-base-300 bg-white transition-all duration-300">
        <input
          type="radio"
          name="faq-accordion"
          className="peer"
          defaultChecked
        />
        <div className="collapse-title font-semibold peer-checked:bg-gray-200">
          How do I create an account?
        </div>
        <div className="collapse-content text-sm text-gray-700 peer-checked:bg-gray-200">
          Creating an account is quick and easy! Simply click the “Sign Up”
          button at the top right of the homepage. You’ll be guided through
          entering your basic information, setting up a password, and verifying
          your email address.
        </div>
      </div>

      <div className="collapse collapse-arrow border border-base-300 bg-white transition-all duration-300">
        <input type="radio" name="faq-accordion" className="peer" />
        <div className="collapse-title font-semibold peer-checked:bg-gray-200">
          I forgot my password. What should I do?
        </div>
        <div className="collapse-content text-sm text-gray-700 peer-checked:bg-gray-200">
          Don’t worry! On the login page, click “Forgot Password” and follow the
          instructions to reset your password using your registered email
          address.
        </div>
      </div>

      <div className="collapse collapse-arrow border border-base-300 bg-white transition-all duration-300">
        <input type="radio" name="faq-accordion" className="peer" />
        <div className="collapse-title font-semibold peer-checked:bg-gray-200">
          How do I update my profile information?
        </div>
        <div className="collapse-content text-sm text-gray-700 peer-checked:bg-gray-200">
          Navigate to “My Account” once logged in, then select “Edit Profile.”
          You can change your personal details and save them easily from there.
        </div>
      </div>

      <div className="collapse collapse-arrow border border-base-300 bg-white transition-all duration-300">
        <input type="radio" name="faq-accordion" className="peer" />
        <div className="collapse-title font-semibold peer-checked:bg-gray-200">
          How can I track my order in real-time?
        </div>
        <div className="collapse-content text-sm text-gray-700 peer-checked:bg-gray-200">
          After placing an order, you’ll receive a tracking number. Use it in
          the “Track Order” section to view your delivery’s status and location.
        </div>
      </div>

      <div className="collapse collapse-arrow border border-base-300 bg-white transition-all duration-300">
        <input type="radio" name="faq-accordion" className="peer" />
        <div className="collapse-title font-semibold peer-checked:bg-gray-200">
          What should I do if my package is delayed or lost?
        </div>
        <div className="collapse-content text-sm text-gray-700 peer-checked:bg-gray-200">
          Contact our support team with your tracking ID. We’ll investigate the
          delay or loss and help resolve it through refund or replacement if
          needed.
        </div>
      </div>
    </div>
  );
};

export default FAQ;
