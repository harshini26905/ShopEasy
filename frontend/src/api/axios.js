import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://shopeasy-7tga.onrender.com",
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("shopeasy_user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
