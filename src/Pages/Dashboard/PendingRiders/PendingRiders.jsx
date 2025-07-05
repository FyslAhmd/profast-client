import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  // Approve/cancel mutations
  const statusMutation = useMutation({
    mutationFn: async ({ id, status, email }) =>
      axiosSecure.patch(`/riders/${id}/status`, { status, email }),
    onSuccess: (data, variables) => {
      Swal.fire(
        "Success!",
        `Rider ${variables.status === "active" ? "approved" : "rejected"}.`,
        variables.status === "active" ? "success" : "info"
      );
      queryClient.invalidateQueries(["pendingRiders"]);
      setSelectedRider(null);
    },
  });

  // Handlers
  const handleStatusUpdate = (id, status, email) => {
    Swal.fire({
      title: "Are you sure?",
      text:
        status === "active"
          ? "Approve this rider application?"
          : "Reject this rider application?",
      icon: status === "active" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: status === "active" ? "Yes, Approve" : "Yes, Reject",
    }).then((result) => {
      if (result.isConfirmed) {
        statusMutation.mutate({ id, status, email });
        refetch();
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Riders</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="text-lg text-black">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Region</th>
              <th>Bike</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-base font-medium">
            {riders.map((rider, idx) => (
              <tr key={rider._id}>
                <td>{idx + 1}</td>
                <td>{rider.rider_name}</td>
                <td>{rider.rider_region}</td>
                <td>
                  {rider.rider_bike} ({rider.rider_bike_no})
                </td>
                <td>
                  <span className="badge badge-warning">{rider.status}</span>
                </td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-primary text-black"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      handleStatusUpdate(rider._id, "active", rider.rider_email)
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() =>
                      handleStatusUpdate(rider._id, "rejected", rider.rider_email)
                    }
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {riders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center">
                  No pending riders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRider && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg mb-2">
              {selectedRider.rider_name}
            </h3>
            <div className="space-y-1 text-base">
              <p>
                <strong>Email:</strong> {selectedRider.rider_email}
              </p>
              <p>
                <strong>Number:</strong> {selectedRider.rider_number}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.rider_region}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.rider_district}
              </p>
              <p>
                <strong>Bike:</strong> {selectedRider.rider_bike} (
                {selectedRider.rider_bike_no})
              </p>
              <p>
                <strong>NID:</strong> {selectedRider.rider_nid}
              </p>
              <p>
                <strong>Age:</strong> {selectedRider.rider_age}
              </p>
              <p>
                <strong>Status:</strong> {selectedRider.status}
              </p>
              <p>
                <strong>Applied At:</strong>{" "}
                {selectedRider.created_at
                  ? new Date(selectedRider.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>
            <div className="modal-action flex gap-2">
              <button
                type="button"
                className="btn"
                onClick={() => setSelectedRider(null)}
              >
                Close
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
