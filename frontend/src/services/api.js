
import axios from "axios";

const api = axios.create({
  baseURL: "https://result-poartel.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("adminToken");

    if (token && token !== "demo-admin-session") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
