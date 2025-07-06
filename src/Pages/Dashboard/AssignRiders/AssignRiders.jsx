import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const AssignRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch assignable parcels
  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcel/assignable");
      return res.data;
    },
  });

  // Fetch active riders when modal is open
  const { data: riders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["activeRidersForParcel", selectedParcel?.sender_wire_house],
    queryFn: async () => {
      if (!selectedParcel?.sender_wire_house) return [];
      const res = await axiosSecure.get(
        `/riders/activeRiders?district=${encodeURIComponent(
          selectedParcel.sender_wire_house
        )}`
      );
      return res.data;
    },
    enabled: modalOpen && !!selectedParcel?.sender_wire_house,
  });

  // Assign rider mutation
  const assignMutation = useMutation({
    mutationFn: async ({ parcelId, riderId, rider_email }) => {
      return axiosSecure.post("/assign-rider", {
        parcelId,
        riderId,
        rider_email,
      });
    },
    onSuccess: () => {
      Swal.fire("Success!", "Rider assigned to parcel.", "success");
      setModalOpen(false);
      setSelectedParcel(null);
      queryClient.invalidateQueries(["assignableParcels"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to assign rider", "error");
    },
  });

  const handleAssignRider = (parcel) => {
    setSelectedParcel(parcel);
    setModalOpen(true);
  };

  const handleRiderAssign = (riderId, rider_email) => {
    assignMutation.mutate({
      parcelId: selectedParcel._id,
      riderId,
      rider_email,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">Assign Riders</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="text-lg font-bold text-black">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Receiver Name</th>
              <th>Receiver Address</th>
              <th>Parcel Type</th>
              <th>Cost</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-base font-medium">
            {parcels.map((parcel, idx) => (
              <tr key={parcel._id}>
                <td>{idx + 1}</td>
                <td>{parcel.tracking_id}</td>
                <td>{parcel.receiver_name}</td>
                <td>{parcel.receiver_address}</td>
                <td>{parcel.parcel_type}</td>
                <td>TK. {parcel.cost}</td>
                <td>
                  {dayjs(parcel.creation_date).format("DD MMM YYYY, h:mm A")}
                </td>
                <td>
                  <button
                    className="btn btn-primary text-black btn-sm"
                    onClick={() => handleAssignRider(parcel)}
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
            {parcels.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center">
                  No parcels available for assignment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedParcel && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <form method="dialog" className="modal-box w-full max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              Assign Rider for Parcel: {selectedParcel.tracking_id}
            </h3>
            {ridersLoading ? (
              <p>Loading riders...</p>
            ) : (
              <div className="overflow-x-auto mb-4">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Bike</th>
                      <th>Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riders.map((rider) => (
                      <tr key={rider._id}>
                        <td>{rider.rider_name}</td>
                        <td>
                          {rider.rider_bike} ({rider.rider_bike_no})
                        </td>
                        <td>{rider.rider_number}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRiderAssign(rider._id, rider.rider_email);
                            }}
                            disabled={assignMutation.isLoading}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                    {riders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No active riders found in this district.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setModalOpen(false);
                  setSelectedParcel(null);
                }}
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

export default AssignRiders;
