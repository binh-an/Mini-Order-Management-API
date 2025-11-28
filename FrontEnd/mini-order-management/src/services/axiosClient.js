import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5273/api", 
  withCredentials: false,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token attached to request:", token.substring(0, 20) + "...");
  } else {
    console.warn("No token found in localStorage!");
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response.data;
  },
  (error) => {
    console.error("Request failed:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosClient;
