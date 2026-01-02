import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // ⬅️ change when backend ready
  withCredentials: true,                 // allow cookies if used
  timeout: 10000,                        // 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- Attach Token To Every Request ----------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- Handle Common API Errors ----------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data?.message);

      // Token expired → logout automatically later if needed
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // window.location.href = "/login";  // enable later if needed
      }
    }
    return Promise.reject(error);
  }
);

export default API;
