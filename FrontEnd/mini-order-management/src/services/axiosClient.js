import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5273/api", // đổi đúng port backend của em
  withCredentials: false,
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
