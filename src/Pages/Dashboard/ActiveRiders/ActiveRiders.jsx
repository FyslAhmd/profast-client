import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);

  // Fetch all active riders
  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (id) =>
      axiosSecure.patch(`/riders/${id}/status`, { status: "inactive" }),
    onSuccess: () => {
      Swal.fire("Success!", "Rider deactivated.", "info");
      queryClient.invalidateQueries(["activeRiders"]);
      setSelectedRider(null);
    },
  });

  const handleDeactivate = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Deactivate",
    }).then((result) => {
      if (result.isConfirmed) {
        statusMutation.mutate(id);
        refetch();
      }
    });
  };

  // CLIENT SIDE FILTER
  const filteredRiders = riders.filter((rider) =>
    rider.rider_name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Active Riders</h1>
      <div className="flex items-center bg-gray-200 rounded-full overflow-hidden shadow-sm max-w-md">
        <input
          type="text"
          placeholder="Search by Name"
          className="flex-grow px-4 py-2 bg-gray-200 focus:outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary text-black rounded-full px-6">
          Search
        </button>
      </div>

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
            {filteredRiders.map((rider, idx) => (
              <tr key={rider._id}>
                <td>{idx + 1}</td>
                <td>{rider.rider_name}</td>
                <td>{rider.rider_region}</td>
                <td>
                  {rider.rider_bike} ({rider.rider_bike_no})
                </td>
                <td>
                  <span className="badge badge-success">{rider.status}</span>
                </td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-primary text-black"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeactivate(rider._id)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {filteredRiders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center">
                  No active riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing full rider details */}
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

export default ActiveRiders;
