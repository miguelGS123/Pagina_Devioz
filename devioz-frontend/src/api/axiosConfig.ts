import axios from "axios";

// ⚠️ CAMBIO CRÍTICO: Apuntamos al Backend que está corriendo en el VPS (Elastika)
const api = axios.create({
  baseURL: "http://38.250.161.108:8008/api", 
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