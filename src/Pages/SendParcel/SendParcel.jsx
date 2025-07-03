import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const SendParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const loaderData = useLoaderData();
  const [parcelType, setParcelType] = useState("document");
  const [weight, setWeight] = useState("");
  const [cost, setCost] = useState(0);
  const [selectedSenderRegion, setSelectedSenderRegion] = useState("");
  const [selectedReceiverRegion, setSelectedReceiverRegion] = useState("");
  const [senderServiceCenters, setSenderServiceCenters] = useState([]);
  const [receiverServiceCenters, setReceiverServiceCenters] = useState([]);

  const regionData = loaderData.reduce((acc, curr) => {
    if (!acc[curr.region]) {
      acc[curr.region] = [];
    }
    acc[curr.region].push(curr);
    return acc;
  }, {});

  const handleSenderRegionChange = (e) => {
    const region = e.target.value;
    setSelectedSenderRegion(region);

    const districts = regionData[region] || [];
    setSenderServiceCenters(
      districts.flatMap((district) => district.covered_area)
    );
  };

  const handleReceiverRegionChange = (e) => {
    const region = e.target.value;
    setSelectedReceiverRegion(region);

    const districts = regionData[region] || [];
    setReceiverServiceCenters(
      districts.flatMap((district) => district.covered_area)
    );
  };

  const calculateCost = () => {
    let price = 0;
    let costStructure = "";

    if (parcelType === "document") {
      price = selectedSenderRegion === selectedReceiverRegion ? 60 : 80;
      costStructure = `
        Document (Any weight):
        - Within Region: TK.60
        - Outside Region: TK.80
      `;
    } else if (parcelType === "non-document") {
      if (weight <= 3) {
        price = selectedSenderRegion === selectedReceiverRegion ? 110 : 150;
        costStructure = `
          Non-Document (Up to 3kg):
          - Within Region: TK.110
          - Outside Region: TK.150
        `;
      } else {
        const additionalCost = (weight - 3) * 40;
        price =
          selectedSenderRegion === selectedReceiverRegion
            ? 110 + additionalCost
            : 150 + additionalCost + 40;
        costStructure = `
          Non-Document (>3kg):
          - Within Region: TK.110 + TK.40/Kg
          - Outside Region: TK.150 + TK.40/Kg + TK.40
        `;
      }
    }

    return { price, costStructure };
  };

  const onSubmit = async (data) => {
    const { price, costStructure } = calculateCost();

    Swal.fire({
      title: "<strong>Delivery Cost Breakdown</strong>", // Strong title for a more professional look
      html: `
    <div style="font-family: 'Arial', sans-serif; padding: 20px; color: #333; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 400px;">
      <p style="font-size: 20px; font-weight: 600; color: #4a90e2;">Parcel Type:</p>
      <p style="font-size: 16px; font-weight: 500; margin-top: 5px; color: #333;">${parcelType}</p>

      <hr style="margin: 15px 0; border: 1px solid #e0e0e0;">

      <p style="font-size: 16px; font-weight: 600; color: #4a90e2;">Weight:</p>
      <p style="font-size: 16px; font-weight: 500; margin-top: 5px; color: #333;">${weight} kg</p>

      <p style="font-size: 16px; font-weight: 600; color: #4a90e2;">Cost Structure:</p>
      <pre style="font-size: 14px; padding: 10px; background-color: #f4f6f9; border-radius: 5px; border: 1px solid #e0e0e0; color: #555; white-space: pre-wrap; word-wrap: break-word; text-align: left;">${costStructure}</pre>

      <hr style="margin: 15px 0; border: 1px solid #e0e0e0;">

      <p style="font-size: 18px; font-weight: 600; color: #4a90e2;">Total Cost: <span style="color: #d9534f;">৳${price}</span></p>
    </div>
  `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28a745", // Green confirm button for positive action
      cancelButtonColor: "#dc3545", // Red cancel button for negative action
      customClass: {
        container: "swal-container",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const trackingId = `TRK${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`;

        const parcelInfo = {
          ...data,
          cost: price,
          parcel_type: parcelType,
          document_weight: parcelType === "document" ? "" : weight,
          created_by: user?.email || "",
          payment_status: "unpaid",
          delivary_status: "not_collected",
          creation_date: new Date().toISOString(),
          tracking_id: trackingId,
        };
        console.log("Parcel Info Submitted:", parcelInfo);

        //save data to server
        axiosSecure
          .post("/parcels", parcelInfo)
          .then((res) => {
            if (res.data.insertedId) {
              Swal.fire({
                icon: "success",
                title: "Redirecting...",
                text: "Processing to payment gateway",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div className="container mx-auto my-4 p-6 md:p-10 bg-white rounded-xl shadow-md max-w-full">
      <h1 className="text-5xl text-center font-extrabold mb-6">Add Parcel</h1>

      <hr className="text-gray-300 my-4" />

      <p className="text-2xl font-extrabold mb-6">Enter Parcel Details</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-start space-x-6 mb-6">
          <input
            type="radio"
            value="document"
            checked={parcelType === "document"}
            onChange={() => setParcelType("document")}
            className="mr-2"
            id="document"
          />{" "}
          <label htmlFor="document" className="font-semibold">
            Document
          </label>
          <input
            type="radio"
            value="non-document"
            checked={parcelType === "non-document"}
            onChange={() => setParcelType("non-document")}
            className="mr-2"
            id="notDocument"
          />{" "}
          <label htmlFor="notDocument" className="font-semibold">
            Not-Document
          </label>
        </div>

        <div className="w-full md:w-1/4">
          <label>Weight of Parcel (kg)</label>
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={`border border-gray-400 p-2 w-full rounded-lg ${
              parcelType === "document" ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
            disabled={parcelType === "document"}
          />
        </div>

        <hr className="text-gray-300 my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-extrabold mb-2">Sender Details</h3>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label>Name</label>
                  <input
                    type="text"
                    {...register("sender_name", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.sender_name && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="flex-1">
                  <label>Your Number</label>
                  <input
                    type="text"
                    {...register("sender_number", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.sender_number && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label>Your Region</label>
                  <select
                    {...register("sender_region", { required: true })}
                    className="border p-2 w-full rounded-lg"
                    value={selectedSenderRegion}
                    onChange={handleSenderRegionChange}
                  >
                    <option value="">Select your region</option>
                    {Object.keys(regionData).map((region, index) => (
                      <option key={index} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.sender_region && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="flex-1">
                  <label>Sender Pickup Wire House</label>
                  <select
                    {...register("sender_wire_house", { required: true })}
                    className="border p-2 w-full rounded-lg"
                  >
                    <option value="">Select Wire House</option>
                    {senderServiceCenters.map((center, index) => (
                      <option key={index} value={center}>
                        {center}
                      </option>
                    ))}
                  </select>
                  {errors.sender_wire_house && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>

              <div>
                <label>Sender Address</label>
                <textarea
                  {...register("sender_address", { required: true })}
                  className="border p-2 w-full rounded-lg"
                />
                {errors.sender_address && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>

              <div>
                <label>Pickup Instruction</label>
                <textarea
                  {...register("pickup_instruction")}
                  className="border p-2 w-full rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-extrabold mb-2">Receiver Details</h3>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label>Name</label>
                  <input
                    type="text"
                    {...register("receiver_name", { required: true })}
                    className="border p-2 w-full rounded-lg"
                  />
                  {errors.receiver_name && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="flex-1">
                  <label>Reciever Number</label>
                  <input
                    type="text"
                    {...register("reciever_number", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.reciever_number && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label>Receiver Region</label>
                  <select
                    {...register("receiver_region", { required: true })}
                    className="border p-2 w-full rounded-lg"
                    value={selectedReceiverRegion}
                    onChange={handleReceiverRegionChange}
                  >
                    <option value="">Select Region</option>
                    {Object.keys(regionData).map((region, index) => (
                      <option key={index} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.receiver_region && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="flex-1">
                  <label>Receiver Delivery Wire House</label>
                  <select
                    {...register("receiver_wire_house", { required: true })}
                    className="border p-2 w-full rounded-lg"
                  >
                    <option value="">Select Wire House</option>
                    {receiverServiceCenters.map((center, index) => (
                      <option key={index} value={center}>
                        {center}
                      </option>
                    ))}
                  </select>
                  {errors.receiver_wire_house && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>
              <div>
                <label>Receiver Address</label>
                <textarea
                  {...register("receiver_address", { required: true })}
                  className="border p-2 w-full rounded-lg"
                />
                {errors.receiver_address && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              <div>
                <label>Delivery Instruction</label>
                <textarea
                  {...register("delivery_instruction")}
                  className="border p-2 w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-primary text-black py-2 px-4 rounded-xl"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
