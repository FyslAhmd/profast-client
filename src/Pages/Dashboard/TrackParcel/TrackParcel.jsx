import React, { useState } from "react";
import useUpdateTrackingStatus from "../../../Hooks/useUpdateTrackingStatus";

const TrackParcel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [trackingId, setTrackingId] = useState("");
  const [parcelId, setParcelId] = useState("");
  const [status, setStatus] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [messageContent, setMessageContent] = useState("");

  // const { updateTrackingStatus, loading, error, message } =
  //   useUpdateTrackingStatus();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTrackingStatus({
      trackingId,
      parcelId,
      status,
      updatedBy,
      messageContent,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">Update Package Status</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter Tracking ID"
            className="border p-2 w-full rounded-lg"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter Parcel ID"
            className="border p-2 w-full rounded-lg"
            value={parcelId}
            onChange={(e) => setParcelId(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary text-black" disabled={loading}>
          {loading ? "Updating..." : "Update Status"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default TrackParcel;
