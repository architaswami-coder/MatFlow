import axios from 'axios';

// Base Axios instance pointing to your Express backend
const API = axios.create({
  baseURL: 'https://matflow-backend.onrender.com/api',
});

// Automatically inject JWT Bearer Token into headers if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;