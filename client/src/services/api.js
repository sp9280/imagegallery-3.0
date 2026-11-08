// client/src/services/api.js
import axios from "axios";

// Helper to get or generate persistent device identifier (1 Device = 1 Like)
const getDeviceId = () => {
  try {
    let deviceId = localStorage.getItem("gallery_device_id");
    if (!deviceId) {
      deviceId = "dev_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem("gallery_device_id", deviceId);
    }
    return deviceId;
  } catch (e) {
    return "dev_guest";
  }
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Attach device identifier for strict 1-device/1-IP like enforcement
  config.headers["x-device-id"] = getDeviceId();
  return config;
});

export default api;
