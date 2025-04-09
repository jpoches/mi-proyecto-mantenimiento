// src/utils/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config/api';

// Crear instancia de axios con la URL base
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000, // Timeout de 15 segundos para detectar problemas de conexión
  withCredentials: true // Importante para CORS con cookies
});

// Interceptor para agregar el token a todas las solicitudes
instance.interceptors.request.use(
  (config) => {
    // Recuperar token del localStorage si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Agregar también el formato antiguo para compatibilidad
      config.headers['x-access-token'] = token;
    }
    
    return config;
  },
  (error) => {
    console.error('Error en la configuración de la solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Manejar errores comunes
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const status = error.response.status;
      const errorMessage = error.response.data?.message || 'Error en la solicitud';

      switch (status) {
        case 401:
          // No autorizado - Posiblemente el token expiró
          toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirigir a la página de login
          window.location.href = '/login';
          break;
        case 403:
          // Prohibido - No tiene permisos
          toast.error('No tiene permisos para realizar esta acción');
          break;
        case 404:
          // No encontrado
          toast.error('Recurso no encontrado');
          break;
        case 500:
          // Error interno del servidor
          toast.error('Error en el servidor. Intente nuevamente más tarde');
          break;
        default:
          // Otros errores
          toast.error(errorMessage);
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      toast.error('No se pudo conectar con el servidor. Verifique su conexión a internet.');
    } else {
      // Error al configurar la solicitud
      toast.error('Error al procesar la solicitud: ' + error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funciones de utilidad para manejar solicitudes
export const api = {
  // GET genérico
  get: async (url, config = {}) => {
    try {
      const response = await instance.get(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // POST genérico
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await instance.post(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // PUT genérico
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await instance.put(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // PATCH genérico
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await instance.patch(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // DELETE genérico
  delete: async (url, config = {}) => {
    try {
      const response = await instance.delete(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Subida de archivos
  upload: async (url, formData, onProgress = null) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      // Si hay una función para monitorear el progreso
      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        };
      }
      
      const response = await instance.post(url, formData, config);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default instance;