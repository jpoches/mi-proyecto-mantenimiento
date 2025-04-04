// client/src/config/api.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Configuración para axios
export const axiosConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};