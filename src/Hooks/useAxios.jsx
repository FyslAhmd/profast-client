import React from "react";
import axios from "axios";

const axiosIns = axios.create({
  baseURL: `https://pro-fast.vercel.app`,
});

const useAxios = () => {
  return axiosIns;
};

export default useAxios;
