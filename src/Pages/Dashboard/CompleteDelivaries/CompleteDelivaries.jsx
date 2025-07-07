import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import dayjs from "dayjs";
import LoadingPage from "../../Shared/LoadingPage";
import Swal from "sweetalert2";

const CompleteDelivaries = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  const { isPending, data: parcels = [] } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/completed-deliveries?riderEmail=${user.email}`
      );
      return res.data;
    },
  });

  // Mutation for cashout
  const cashOutMutation = useMutation({
    mutationFn: async ({ parcelId, income, rider_email }) => {
      return axiosSecure.patch(`/parcels/${parcelId}/cashout`, {
        income,
        rider_email,
      });
    },
    onSuccess: () => {
      Swal.fire("Success", "Cash out complete", "success");
      queryClient.invalidateQueries(["completedDeliveries"]);
    },
    onError: () => {
      Swal.fire("Error", "Cash out failed", "error");
    },
  });

  const calculateIncome = (parcel) => {
    if (parcel.sender_region && parcel.receiver_region) {
      if (parcel.sender_region === parcel.receiver_region) {
        return Math.round(parcel.cost * 0.4);
      } else {
        return Math.round(parcel.cost * 0.1);
      }
    }
    return 0;
  };

  if (isPending || loading) {
    return <LoadingPage />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">Completed Deliveries</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="text-lg font-bold text-black">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Sender Name</th>
              <th>Sender Address</th>
              <th>Rider's Income</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-base font-medium">
            {parcels.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No completed deliveries found.
                </td>
              </tr>
            ) : (
              parcels.map((parcel, idx) => {
                const income = calculateIncome(parcel);
                const isCashedOut = parcel.rider_money === "cashed_out";
                return (
                  <tr key={parcel._id}>
                    <td>{idx + 1}</td>
                    <td>{parcel.tracking_id}</td>
                    <td>{parcel.sender_name}</td>
                    <td>{parcel.sender_address}</td>
                    <td>
                      TK.{" "}
                      <span className="text-green-700 font-bold">{income}</span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-success btn-sm ${
                          isCashedOut
                            ? "btn-disabled bg-gray-400 border-gray-400"
                            : ""
                        }`}
                        onClick={() =>
                          cashOutMutation.mutate({
                            parcelId: parcel._id,
                            income,
                            rider_email: user.email,
                          })
                        }
                        disabled={isCashedOut || cashOutMutation.isLoading}
                      >
                        {isCashedOut ? "Cashed Out" : "Cash Out"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompleteDelivaries;
