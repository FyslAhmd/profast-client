import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const STATUS_COLORS = {
  submitted: "bg-blue-500",
  paid: "bg-green-500",
  assigned: "bg-yellow-500",
  delivered: "bg-primary",
  default: "bg-gray-400",
};

const formatStatus = (status) => {
  if (!status) return "";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (iso) => {
  return new Date(iso).toLocaleString();
};

const TrackParcel = () => {
  const [trackingId, setTrackingId] = useState("");
  const [searchId, setSearchId] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    data: trackingLogs = [],
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tracking", searchId],
    enabled: !!searchId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/track/${searchId}`);
      return res.data;
    },
    staleTime: 0,
    retry: false,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchId(trackingId.trim());
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-center">Track Your Parcel</h1>

      <div className="relative z-[999] max-w-md my-6">
        <div className="flex items-center bg-gray-200 rounded-full overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Enter your Tracking ID"
            className="flex-grow px-4 py-2 bg-gray-200 focus:outline-none text-sm"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary text-black rounded-full px-6"
            onClick={handleSearch}
          >
            Track
          </button>
        </div>
      </div>

      {!searchId && (
        <div className="text-gray-500 text-lg mt-10">
          Enter your Tracking ID above to view real-time delivery progress.
        </div>
      )}

      {searchId && isFetching && (
        <div className="text-primary text-lg font-semibold mt-6">
          Fetching tracking updates...
        </div>
      )}

      {searchId && !isFetching && isError && (
        <div className="text-red-500 mt-6">
          Could not find tracking information. Please check your Tracking ID.
        </div>
      )}

      {searchId && !isFetching && trackingLogs?.length === 0 && (
        <div className="text-gray-600 mt-6">
          No tracking events found for this ID.
        </div>
      )}

      {searchId && !isFetching && trackingLogs?.length > 0 && (
        <div className="w-full max-w-2xl mt-4">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200 z-0 rounded"></div>
            <ul className="space-y-8 z-10 relative">
              {trackingLogs.map((log, idx) => (
                <li className="flex items-start gap-5" key={idx}>
                  <span
                    className={`w-6 h-6 rounded-full border-4 border-white shadow-md flex-shrink-0 ${
                      STATUS_COLORS[log.status] || STATUS_COLORS.default
                    }`}
                  />
                  <div>
                    <div className="font-bold text-lg">
                      {formatStatus(log.status)}
                    </div>
                    <div className="text-sm text-gray-600">{log.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDate(log.time)}
                    </div>
                    {log.updated_by && (
                      <div className="text-xs text-gray-500">
                        Updated by: {log.updated_by}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
