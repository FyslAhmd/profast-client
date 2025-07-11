import React from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/en";
import LoadingPage from "../../Shared/LoadingPage";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  if (loading) {
    return <LoadingPage></LoadingPage>;
  }

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    enabled: !!user.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/paymentsHistory?email=${user.email}`);
      return res.data;
    },
  });
  if (isPending) {
    return <LoadingPage></LoadingPage>;
  }
  const formatDate = (date) => {
    return dayjs(date).locale("en").format("DD MMM YYYY, h:mm A");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">Payment History</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="text-lg font-bold text-black">
            <tr>
              <th>Parcel ID</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Paid At</th>
            </tr>
          </thead>
          <tbody className="text-base font-medium">
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.parcelId}</td>
                <td>{payment.amount}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.tnxId}</td>
                <td>{formatDate(payment.paid_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
