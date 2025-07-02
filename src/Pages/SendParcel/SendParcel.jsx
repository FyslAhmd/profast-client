import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import useAuth from "../../Hooks/useAuth";

const SendParcel = () => {
  const { user } = useAuth();
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
  const [parcelData, setParcelData] = useState(null);

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
      title: "Delivery Cost Breakdown",
      html: `
        <div style="padding: 20px;">
          <p style="font-size: 18px; font-weight: bold;">Parcel Type: ${parcelType}</p>
          <p style="font-size: 16px;">Weight: ${weight} kg</p>
          <p style="font-size: 16px;">Cost Structure:</p>
          <pre style="font-size: 14px;text-align:start; background-color: #f7f7f7; border-radius: 5px;">${costStructure}</pre>
          <p style="font-size: 18px; font-weight: bold; margin-top: 10px;">Total Cost: ৳${price}</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const trackingId = `TRK${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`;

        const parcelInfo = {
          ...data,
          cost: price,
          creation_date: new Date().toISOString(),
          user_email: user?.email || "",
          tracking_id: trackingId,
        };
        setParcelData(parcelInfo);
        console.log("Parcel Info Submitted:", parcelInfo);

        Swal.fire(
          "Parcel Added!",
          "Your parcel details have been successfully submitted.",
          "success"
        );
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
                  <label>Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    {...register("sender_email", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.sender_email && (
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
                  <label>Email</label>
                  <input
                    type="email"
                    {...register("receiver_email", { required: true })}
                    className="border p-2 w-full rounded-lg"
                  />
                  {errors.receiver_email && (
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
