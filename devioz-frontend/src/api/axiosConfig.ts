import axios from "axios";

const api = axios.create({
  // ✅ CAMBIO: IP Pública de tu VPS en lugar de localhost
  baseURL: "http://34.70.194.150:8008/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;