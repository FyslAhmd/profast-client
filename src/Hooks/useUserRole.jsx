import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role?email=${user.email}`);
      return res.data.role;
    },
  });

  return {
    role: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useUserRole;
