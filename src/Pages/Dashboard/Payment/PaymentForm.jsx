import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-ring loading-xl"></span>
        </div>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const card = elements.getElement(CardElement);

    if (!stripe || !elements || !card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log(paymentMethod);
    }
    //create payment intent
    const paymentIntent = await axiosSecure.post("/create-payment-intent", {
      amount: parcelInfo.cost * 100,
      parcelId: parcelId,
    });
    const clientSecret = paymentIntent.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });
    if (result.error) {
      setError(result.error.message);
    } else {
      setError("");
      if (result.paymentIntent.status === "succeeded") {
        console.log(result);

        //send to database
        const paymentData = {
          parcelId,
          email: user.email,
          amount: parcelInfo.cost,
          tnxId: result.paymentIntent.id,
          paymentMethod: result.paymentIntent.payment_method_types,
        };
        const paymentRes = await axiosSecure.post("/payments", paymentData);
        if (paymentRes.data.insertedId) {
          console.log("payment success");
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            html: `<strong>Transaction ID:</strong> <code>${result.paymentIntent.id}</code>`,
            confirmButtonText: "Go to My Parcels",
          });
          navigate("/dashboard/myParcels");
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Secure Payment
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Please enter your payment details
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="card"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Card Information
            </label>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#333",
                    "::placeholder": {
                      color: "#ccc",
                    },
                  },
                  invalid: {
                    color: "#e74c3c",
                  },
                },
              }}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={!stripe}
              className="w-full py-3 bg-primary text-black font-bold rounded-xl disabled:bg-gray-400 transition-all duration-300"
            >
              Pay {`TK. ${parcelInfo.cost}`}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            By clicking "Pay Now", you agree to our{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
