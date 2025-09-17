import axios from "axios";

// 1. Define the base URL dynamically, just like in api.js
// This ensures it works both locally and on Render.
const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/accounts/";

const api = axios.create({
  // Use the baseURL variable here
  baseURL: baseURL,
});

// Attach access token to every request (this part is correct)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh (this part is now fixed)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for a 401 error and that we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        
        // 2. Make the refresh call dynamic as well, using the same baseURL
        // and the new backend endpoint.
        const res = await axios.post(`${baseURL}token/refresh/`, {
          refresh,
        });

        localStorage.setItem("access", res.data.access);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;
        
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token expired, please log in again");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login"; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default api;