import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import riderLogo from "../../assets/agent-pending.png";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const RiderRegistration = () => {
  const [selectedSenderRegion, setSelectedRiderRegion] = useState("");
  const [riderServiceCenters, setRiderServiceCenters] = useState([]);
  const loaderData = useLoaderData();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const regionData = loaderData.reduce((acc, curr) => {
    if (!acc[curr.region]) {
      acc[curr.region] = [];
    }
    acc[curr.region].push(curr);
    return acc;
  }, {});

  const handleRiderRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRiderRegion(region);

    const districts = regionData[region] || [];
    setRiderServiceCenters(
      districts.flatMap((district) => district.covered_area)
    );
  };

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      rider_email: user.email,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    console.log(riderData);

    //save in db
    axiosSecure.post("/riders", riderData).then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Rider Registration Successfull",
          text: "Your application is under review.",
        });
      }
    });
  };

  return (
    <div className="container mx-auto my-4 p-6 md:p-10 bg-white rounded-xl shadow-md max-w-full">
      <h1 className="text-5xl font-extrabold mb-6">Be a Rider</h1>
      <p className="font-medium mb-6 w-1/2">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>

      <hr className="text-gray-300 my-4" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-extrabold mb-2">
              Tell us about yourself
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label>Name</label>
                  <input
                    type="text"
                    {...register("rider_name", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.rider_name && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="flex-1">
                  <label>Your Number</label>
                  <input
                    type="text"
                    {...register("rider_number", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.rider_number && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label>NID Number</label>
                  <input
                    type="text"
                    {...register("rider_nid", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.rider_nid && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="flex-1">
                  <label>Your Age</label>
                  <input
                    type="number"
                    {...register("rider_age", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.rider_age && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label>Bike Brand</label>
                  <input
                    type="text"
                    {...register("rider_bike", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.rider_bike && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="flex-1">
                  <label>Bike Registration No.</label>
                  <input
                    type="text"
                    {...register("rider_bike_no", { required: true })}
                    className="border border-gray-400 p-2 w-full rounded-lg"
                  />
                  {errors.rider_bike_no && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label>Your Region</label>
                  <select
                    {...register("rider_region", { required: true })}
                    className="border p-2 w-full rounded-lg"
                    value={selectedSenderRegion}
                    onChange={handleRiderRegionChange}
                  >
                    <option value="">Select your region</option>
                    {Object.keys(regionData).map((region, index) => (
                      <option key={index} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.rider_region && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="flex-1">
                  <label>Your District</label>
                  <select
                    {...register("rider_district", { required: true })}
                    className="border p-2 w-full rounded-lg"
                  >
                    <option value="">Select District</option>
                    {riderServiceCenters.map((center, index) => (
                      <option key={index} value={center}>
                        {center}
                      </option>
                    ))}
                  </select>
                  {errors.rider_district && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-black font-semibold py-2 px-4 rounded-xl w-full"
              >
                Continue
              </button>
            </div>
          </div>

          <div className="w-full h-full flex justify-center items-center">
            <img src={riderLogo} className="w-80" alt="riderLogo" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default RiderRegistration;
