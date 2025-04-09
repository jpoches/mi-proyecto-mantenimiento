// src/config/api.js
// URL base para la API
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
// Tiempo de expiración del token en milisegundos (1 hora)
export const TOKEN_EXPIRATION_TIME = 3600 * 1000;

// Opciones para las solicitudes a la API
export const apiConfig = {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
};

// Opciones para notificaciones toast
export const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};