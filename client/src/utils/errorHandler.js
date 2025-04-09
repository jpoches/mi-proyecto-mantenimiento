// src/utils/errorHandler.js
import { toast } from 'react-toastify';

/**
 * Manejador centralizado de errores
 */
const errorHandler = {
  /**
   * Procesa un error de API y muestra una notificación
   * @param {Error} error - Error capturado
   * @param {string} customMessage - Mensaje personalizado (opcional)
   * @param {Object} options - Opciones adicionales
   * @returns {Error} El error original
   */
  processError(error, customMessage = null, options = {}) {
    // Obtener mensaje del error
    let errorMessage = customMessage;
    
    if (!errorMessage) {
      // Intentar obtener el mensaje del error desde la respuesta
      errorMessage = error.response?.data?.message;
      
      // Si no hay mensaje específico, usar uno genérico según el código
      if (!errorMessage) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              errorMessage = 'Solicitud incorrecta. Verifique los datos enviados.';
              break;
            case 401:
              errorMessage = 'No autorizado. Inicie sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'Acceso denegado. No tiene permisos para esta acción.';
              break;
            case 404:
              errorMessage = 'El recurso solicitado no existe.';
              break;
            case 409:
              errorMessage = 'Conflicto. El recurso ya existe o está en uso.';
              break;
            case 422:
              errorMessage = 'Datos de entrada inválidos.';
              break;
            case 500:
              errorMessage = 'Error del servidor. Intente nuevamente más tarde.';
              break;
            default:
              errorMessage = error.message || 'Ha ocurrido un error inesperado.';
          }
        } else {
          // Error de red o sin respuesta
          errorMessage = error.message || 'Error de conexión. Revise su conexión a internet.';
          
          if (error.message && error.message.includes('Network Error')) {
            errorMessage = 'Error de conexión al servidor. Revise su conexión a internet.';
          }
        }
      }
    }
    
    // Determinar si se debe mostrar la notificación
    const { showToast = true, toastOptions = {} } = options;
    
    if (showToast) {
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...toastOptions
      });
    }
    
    // Registrar error en consola
    console.error('Error capturado:', {
      message: errorMessage,
      originalError: error,
      response: error.response,
      request: error.request,
    });
    
    // Devolver el error original para manejo adicional si es necesario
    return error;
  },
  
  /**
   * Maneja errores de validación de formularios
   * @param {Object} errors - Objeto de errores de validación
   * @param {boolean} showToast - Si se debe mostrar una notificación
   * @returns {Object} Errores procesados
   */
  handleValidationErrors(errors, showToast = true) {
    if (!errors || Object.keys(errors).length === 0) {
      return {};
    }
    
    // Extraer el primer mensaje de error para la notificación
    let firstErrorMessage = 'Hay errores en el formulario';
    
    for (const field in errors) {
      if (errors[field] && errors[field].message) {
        firstErrorMessage = errors[field].message;
        break;
      }
    }
    
    if (showToast) {
      toast.error(firstErrorMessage);
    }
    
    return errors;
  },
  
  /**
   * Maneja errores específicos de autorización
   * @param {Error} error - Error capturado
   * @param {Function} logoutCallback - Función para cerrar sesión
   * @returns {Error} Error procesado
   */
  handleAuthError(error, logoutCallback) {
    // Verificar si es un error de autorización
    if (error.response && error.response.status === 401) {
      toast.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
      
      // Ejecutar la función de cierre de sesión si se proporcionó
      if (typeof logoutCallback === 'function') {
        setTimeout(() => {
          logoutCallback();
        }, 2000);
      }
    } else {
      // Manejar como error normal
      this.processError(error);
    }
    
    return error;
  }
};

export default errorHandler;