import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import dayjs from "dayjs";
import "dayjs/locale/bn";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { useState } from "react";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
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

  const handleView = (parcel) => {
    setSelectedParcel(parcel);
  };

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
        {selectedParcel && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box">
              <h3 className="font-bold text-2xl mb-2">Parcel Details</h3>
              <div className="space-y-1 text-base">
                <p>
                  <strong>Tracking ID:</strong> {selectedParcel.tracking_id}
                </p>
                <p>
                  <strong>Parcel Type:</strong> {selectedParcel.parcel_type}
                </p>
                <p>
                  <strong>Cost:</strong> TK. {selectedParcel.cost}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {selectedParcel.payment_status}
                </p>
                <p>
                  <strong>Delivery Status:</strong>{" "}
                  {selectedParcel.delivary_status}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {formatDate(selectedParcel.creation_date)}
                </p>
                <hr className="my-2" />
                <h4 className="font-semibold">Sender Info</h4>
                <p>
                  <strong>Name:</strong> {selectedParcel.sender_name}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedParcel.sender_number}
                </p>
                <p>
                  <strong>Region:</strong> {selectedParcel.sender_region}
                </p>
                <p>
                  <strong>Wire House:</strong>{" "}
                  {selectedParcel.sender_wire_house}
                </p>
                <p>
                  <strong>Address:</strong> {selectedParcel.sender_address}
                </p>
                <p>
                  <strong>Pickup Instruction:</strong>{" "}
                  {selectedParcel.pickup_instruction}
                </p>
                <hr className="my-2" />
                <h4 className="font-semibold">Receiver Info</h4>
                <p>
                  <strong>Name:</strong> {selectedParcel.receiver_name}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedParcel.reciever_number}
                </p>
                <p>
                  <strong>Region:</strong> {selectedParcel.receiver_region}
                </p>
                <p>
                  <strong>Wire House:</strong>{" "}
                  {selectedParcel.receiver_wire_house}
                </p>
                <p>
                  <strong>Address:</strong> {selectedParcel.receiver_address}
                </p>
                <p>
                  <strong>Delivery Instruction:</strong>{" "}
                  {selectedParcel.delivery_instruction}
                </p>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setSelectedParcel(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default MyParcels;
