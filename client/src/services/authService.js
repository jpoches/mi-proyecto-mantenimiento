// client/src/services/authService.js
import axios from 'axios';
import { API_URL } from '../config/api';

// Configuración de axios
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Agregar interceptor para manejar tokens
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor retorna un error 401 (no autorizado), redirigir al login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicio de autenticación
const authService = {
  // Iniciar sesión
  login: async (username, password) => {
    const response = await instance.post('/auth/signin', {
      username,
      password
    });
    
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    
    return response.data;
  },

  // Registrar nuevo usuario
  register: async (userData) => {
    return await instance.post('/auth/signup', userData);
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
  },

  // Obtener el usuario actual
  getCurrentUser: async () => {
    return await instance.get('/auth/me');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
export { instance as api };