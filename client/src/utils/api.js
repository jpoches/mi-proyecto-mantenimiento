// src/utils/api.js
import axios from './axios';
import { toast } from 'react-toastify';

/**
 * Utilidades para manejar solicitudes a la API
 */

// Opciones por defecto para las notificaciones toast
const defaultToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

// Función para manejar errores de API
export const handleApiError = (error, customMessage = null) => {
  console.error('API Error:', error);
  
  // Determinar el mensaje de error a mostrar
  let errorMessage = customMessage;
  
  if (!errorMessage) {
    errorMessage = error.response?.data?.message 
      || error.message 
      || 'Ha ocurrido un error. Por favor, intente nuevamente.';
  }
  
  // Mostrar notificación de error
  toast.error(errorMessage, defaultToastOptions);
  
  // Retornar el error para manejo adicional si es necesario
  return error;
};

// Función genérica para obtener datos de la API
export const fetchData = async (endpoint, options = {}) => {
  try {
    const { showSuccessToast, successMessage, errorMessage, params } = options;
    
    const response = await axios.get(endpoint, { params });
    
    if (showSuccessToast && successMessage) {
      toast.success(successMessage, defaultToastOptions);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error, errorMessage);
    throw error;
  }
};

// Función genérica para crear un nuevo recurso
export const createResource = async (endpoint, data, options = {}) => {
  try {
    const { 
      showSuccessToast = true, 
      successMessage = 'Recurso creado exitosamente', 
      errorMessage = null,
      isFormData = false
    } = options;
    
    // Configuración para envío de FormData si es necesario
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};
    
    const response = await axios.post(endpoint, data, config);
    
    if (showSuccessToast) {
      toast.success(successMessage, defaultToastOptions);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error, errorMessage);
    throw error;
  }
};

// Función genérica para actualizar un recurso existente
export const updateResource = async (endpoint, data, options = {}) => {
  try {
    const { 
      showSuccessToast = true, 
      successMessage = 'Recurso actualizado exitosamente', 
      errorMessage = null,
      method = 'put', // 'put' o 'patch'
      isFormData = false
    } = options;
    
    // Configuración para envío de FormData si es necesario
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};
    
    const response = method === 'patch' 
      ? await axios.patch(endpoint, data, config)
      : await axios.put(endpoint, data, config);
    
    if (showSuccessToast) {
      toast.success(successMessage, defaultToastOptions);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error, errorMessage);
    throw error;
  }
};

// Función genérica para eliminar un recurso
export const deleteResource = async (endpoint, options = {}) => {
  try {
    const { 
      showSuccessToast = true, 
      successMessage = 'Recurso eliminado exitosamente', 
      errorMessage = null,
      confirmDelete = true,
      confirmMessage = '¿Está seguro de eliminar este elemento?'
    } = options;
    
    // Solicitar confirmación si es necesario
    if (confirmDelete) {
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return null;
    }
    
    const response = await axios.delete(endpoint);
    
    if (showSuccessToast) {
      toast.success(successMessage, defaultToastOptions);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error, errorMessage);
    throw error;
  }
};

// Función para manejar paginación
export const fetchPaginatedData = async (endpoint, page = 0, size = 10, options = {}) => {
  try {
    const { filters = {}, sort = null } = options;
    
    // Construir parámetros de consulta
    const params = {
      page,
      size,
      ...filters
    };
    
    // Agregar parámetro de ordenamiento si existe
    if (sort) {
      params.sort = sort;
    }
    
    const response = await axios.get(endpoint, { params });
    
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Exportar instancia de axios configurada
export { default as api } from './axios';