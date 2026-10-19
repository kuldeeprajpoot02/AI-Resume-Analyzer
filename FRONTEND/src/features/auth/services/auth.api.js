
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const authApi = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Register user
export const registerUser = async (userData) => {
  const response = await authApi.post("/register", userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await authApi.post("/login", credentials);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await authApi.get("/logout");
  return response.data;
};

// Get logged-in user
export const getMe = async () => {
  const response = await authApi.get("/get-me");
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await authApi.post("/forgot-password", {
    email,
  });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await authApi.post(
    `/reset-password/${encodeURIComponent(token)}`,
    { password }
  );
  return response.data;
};

export default authApi;
