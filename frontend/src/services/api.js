import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // your backend port
  withCredentials: true,           // send cookies (auth)
});

// Optional: global error logging
api.interceptors.response.use(
  res => res,
  err => {
    console.error("API error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;