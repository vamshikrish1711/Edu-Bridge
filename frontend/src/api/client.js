// frontend/src/api/client.js
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eb_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    if (status === 401 && !url.includes("/auth/login")) {
      localStorage.removeItem("eb_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function apiError(error) {
  const data = error.response?.data;
  if (data?.fields) {
    const first = Object.values(data.fields)[0];
    if (Array.isArray(first) && first.length) return first[0];
  }
  return data?.error || "Request failed. Try again.";
}

export default api;
