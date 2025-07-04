import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import dayjs from "dayjs";
import "dayjs/locale/bn";
import Swal from "sweetalert2";
import { Link } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });
  const formatDate = (date) => {
    return dayjs(date).locale("en").format("DD MM YYYY, h:mm A");
  };

  const handleView = (parcel) => {};

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axiosSecure
            .delete(`/parcels/${id}`)
            .then((res) => {
              console.log(res.data);
              if (res.data.deletedCount) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                });
                refetch();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold mb-6">Parcel Management</h1>
      <div className="overflow-x-auto p-6">
        <table className="table table-zebra w-full">
          <thead className="text-black text-lg">
            <tr>
              <th>Parcel Type</th>
              <th>Date & Time</th>
              <th>Cost</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-base font-medium">
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.parcel_type}</td>
                <td>{formatDate(parcel.creation_date)}</td>
                <td>TK. {parcel.cost}</td>
                <td>
                  <span
                    className={`rounded-lg p-2 font-semibold ${
                      parcel.payment_status === "paid"
                        ? "bg-primary text-black"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {parcel.payment_status === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleView(parcel)}
                    className="btn btn-primary text-black rounded-lg btn-sm mr-2"
                  >
                    View
                  </button>
                  {parcel.payment_status === "paid" ? (
                    <button
                      className="btn btn-success btn-sm mr-2 cursor-not-allowed"
                      disabled
                    >
                      Paid
                    </button>
                  ) : (
                    <Link to={`/dashboard/payment/${parcel._id}`}>
                      <button className="btn btn-success btn-sm mr-2">
                        Pay
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(parcel._id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
