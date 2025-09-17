import axios from "axios";


// and the localhost URL for local development.
const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/accounts/";


const API = axios.create({
  // Use the baseURL variable defined above
  baseURL: baseURL, 
});

// Add token to headers automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;