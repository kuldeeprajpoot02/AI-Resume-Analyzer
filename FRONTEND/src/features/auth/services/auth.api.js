
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const authApi = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = async (userData) => {
  const response = await authApi.post("/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await authApi.post("/login", credentials);
  return response.data;
};

export const logout = async () => {
  const response = await authApi.get("/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await authApi.get("/get-me");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await authApi.post("/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await authApi.post(
    `/reset-password/${encodeURIComponent(token)}`,
    { password }
  );
  return response.data;
};

export default authApi;
