import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import dayjs from "dayjs";
import LoadingPage from "../../Shared/LoadingPage";
import { FaMoneyBillWave, FaRegSmile } from "react-icons/fa";

const MyEarnings = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Total earnings query
  const { data: earnings, isPending } = useQuery({
    queryKey: ["riderEarnings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/earnings?email=${user.email}`);
      return res.data;
    },
  });

  // Recent cashouts query (optional)
  const { data: cashouts = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ["cashouts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/earnings/history?email=${user.email}`);
      return res.data;
    },
  });

  if (isPending || loading) return <LoadingPage />;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
        <FaMoneyBillWave className="text-green-500" /> My Earnings
      </h1>
      <p className="mb-6 text-lg font-medium text-gray-500">
        Track your income and celebrate your achievements!
      </p>

      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between p-8 mb-10">
        <div>
          <div className="text-2xl font-bold text-gray-700 mb-1">Total Earnings</div>
          <div className="text-5xl font-extrabold text-green-600">
            TK. {earnings?.total_earning || 0}
          </div>
          <div className="mt-2 text-gray-500 text-sm">
            Last updated: {dayjs().format("DD MMM YYYY, h:mm A")}
          </div>
        </div>
        <div className="flex flex-col items-center mt-6 md:mt-0">
          <FaRegSmile className="text-6xl text-green-300 mb-2" />
          <span className="text-xl text-green-700 font-semibold">
            Keep delivering, keep earning!
          </span>
        </div>
      </div>

      {/* Recent cashouts/history */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-3">Recent Cashouts</h2>
        {isHistoryLoading ? (
          <LoadingPage />
        ) : cashouts.length === 0 ? (
          <div className="text-gray-500">No cashout history yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tracking ID</th>
                  <th>Sender Name</th>
                  <th>Cashout Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {cashouts.map((parcel, idx) => {
                  // Region calculation
                  let income = 0;
                  if (parcel.sender_region === parcel.receiver_region) {
                    income = Math.round((parcel.cost || 0) * 0.4);
                  } else {
                    income = Math.round((parcel.cost || 0) * 0.1);
                  }
                  return (
                    <tr key={parcel._id}>
                      <td>{idx + 1}</td>
                      <td>{parcel.tracking_id}</td>
                      <td>{parcel.sender_name}</td>
                      <td>TK. {income}</td>
                      <td>
                        {parcel.creation_date
                          ? dayjs(parcel.creation_date).format("DD MMM YYYY, h:mm A")
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEarnings;
