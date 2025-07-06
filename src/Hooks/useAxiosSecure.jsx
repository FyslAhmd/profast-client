// import React from "react";
// import axios from "axios";
// import useAuth from "./useAuth";
// import { useNavigate } from "react-router";

// const axiosSecure = axios.create({
//   baseURL: `http://localhost:5000`,
// });

// const useAxiosSecure = () => {
//   const { user, logOutUser, loading } = useAuth();
//   const navigate = useNavigate();
//   if (loading) {
//     return <h1>Loading...</h1>;
//   }
//   axiosSecure.interceptors.request.use(
//     (config) => {
//       config.headers.authorization = `Bearer ${user.accessToken}`;
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   axiosSecure.interceptors.response.use(
//     (res) => {
//       return res;
//     },
//     (error) => {
//       const status = error.response?.status;
//       if (status === 403) {
//         navigate("/forbidden");
//       } else if (status === 401) {
//         logOutUser()
//           .then(() => {
//             navigate("/login");
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       }
//       return Promise.reject(error);
//     }
//   );
//   return axiosSecure;
// };

// export default useAxiosSecure;

import React from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxiosSecure = () => {
  const { logOutUser } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    async (config) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error.response?.status;
      if (status === 403) {
        navigate("/forbidden");
      } else if (status === 401) {
        logOutUser()
          .then(() => {
            navigate("/login");
          })
          .catch((err) => {
            console.log(err);
          });
      }
      return Promise.reject(error);
    }
  );
  return axiosSecure;
};

export default useAxiosSecure;
