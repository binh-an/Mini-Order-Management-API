import axios from "axios";

const API_URL = "http://localhost:5273/api/Auth"; // URL backend 

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });

    return response.data; // sẽ chứa { username, email, token }
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password
    });

    return response.data; // message: "User registered successfully"
  } catch (error) {
    throw error.response?.data || "Register failed";
  }
};

