// src/api/authApi.js
import axiosClient from "../services/axiosClient";

export const login = async (username, password) => {
  return await axiosClient.post("Auth/login", { username, password });
};

export const register = async (username, email, password) => {
  return await axiosClient.post("/Auth/register", { username, email, password });
};
