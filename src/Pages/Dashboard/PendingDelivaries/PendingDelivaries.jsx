import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const PendingDelivaries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["pendingDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/pending-deliveries?riderEmail=${user?.email}`
      );
      return res.data;
    },
  });

  // Mutation for marking as delivered
  const deliverMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.patch(`/parcels/${id}/delivered`);
    },
    onSuccess: () => {
      Swal.fire("Success!", "Parcel marked as delivered.", "success");
      queryClient.invalidateQueries(["pendingDeliveries", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update status.", "error");
    },
  });

  const handleDeliver = (id) => {
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to mark this as delivered?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Deliver",
    }).then((result) => {
      if (result.isConfirmed) {
        deliverMutation.mutate(id);
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">My Pending Deliveries</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="text-lg font-bold text-black">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Sender Name</th>
              <th>Sender Address</th>
              <th>Parcel Type</th>
              <th>Cost</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-base font-medium">
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : parcels.length > 0 ? (
              parcels.map((parcel, idx) => (
                <tr key={parcel._id}>
                  <td>{idx + 1}</td>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.sender_name}</td>
                  <td>{parcel.sender_address}</td>
                  <td>{parcel.parcel_type}</td>
                  <td>TK. {parcel.cost}</td>
                  <td>
                    {dayjs(parcel.creation_date).format("DD MMM YYYY, h:mm A")}
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleDeliver(parcel._id)}
                      disabled={deliverMutation.isLoading}
                    >
                      Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No pending deliveries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingDelivaries;
