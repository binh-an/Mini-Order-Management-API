import axios from "axios";

const API_URL = "http://localhost:5205/api/Auth"; // URL backend 

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
