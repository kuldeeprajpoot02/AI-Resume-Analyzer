import axios from "axios";

const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
  ).replace(/\/+$/, ""),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = async ({ username, email, password }) => {
  const res = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await api.post("/api/auth/login", {
    email,
    password,
  });
  return res.data;
};

export const logout = async () => {
  const res = await api.get("/api/auth/logout");
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/api/auth/get-me");
  return res.data;
};

export default api;
