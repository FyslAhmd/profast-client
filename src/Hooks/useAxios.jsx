import React from "react";
import axios from "axios";

const axiosIns = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxios = () => {
  return axiosIns;
};

export default useAxios;
