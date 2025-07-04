import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useUpdateTrackingStatus = () => {
  const axiosSecure = useAxiosSecure();

  const mutation = useMutation(
    async ({ trackingId, parcelId, status, updatedBy, messageContent }) => {
      if (!trackingId || !parcelId || !status || !updatedBy) {
        throw new Error("All fields are required");
      }

      const response = await axiosSecure.post("/trackParcel", {
        tracking_id: trackingId,
        parcel_id: parcelId,
        status: status,
        message: messageContent,
        updated_by: updatedBy,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log("Tracking status updated successfully:", data.message);
      },
      onError: (error) => {
        console.error("Error updating tracking status:", error.message);
      },
    }
  );

  return {
    updateTrackingStatus: mutation.mutate,
    loading: mutation.isLoading,
    error: mutation.isError ? mutation.error.message : null,
    message: mutation.isSuccess ? "Tracking status updated successfully" : null,
  };
};

export default useUpdateTrackingStatus;
