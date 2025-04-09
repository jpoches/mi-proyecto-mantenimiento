// client/src/services/request.service.js
import api from '../utils/axios';
import { toast } from 'react-toastify';

class RequestService {
  /**
   * Obtener todas las solicitudes
   * @returns {Promise<Array>} Lista de solicitudes
   */
  async getAll() {
    try {
      const response = await api.get('/requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes recientes
   * @returns {Promise<Array>} Lista de solicitudes recientes
   */
  async getRecent() {
    try {
      const response = await api.get('/requests/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent requests:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes aprobadas
   * @returns {Promise<Array>} Lista de solicitudes aprobadas
   */
  async getApproved() {
    try {
      const response = await api.get('/requests/approved');
      return response.data;
    } catch (error) {
      console.error('Error fetching approved requests:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes por cliente
   * @param {number} clientId - ID del cliente
   * @returns {Promise<Array>} Lista de solicitudes del cliente
   */
  async getByClient(clientId) {
    try {
      const response = await api.get(`/requests/client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching requests for client ${clientId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes recientes por cliente
   * @param {number} clientId - ID del cliente
   * @returns {Promise<Array>} Lista de solicitudes recientes del cliente
   */
  async getRecentByClient(clientId) {
    try {
      const response = await api.get(`/requests/client/${clientId}/recent`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recent requests for client ${clientId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener una solicitud específica
   * @param {number} id - ID de la solicitud
   * @returns {Promise<Object>} Datos de la solicitud
   */
  async getById(id) {
    try {
      const response = await api.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching request ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear una nueva solicitud
   * @param {Object} data - Datos de la solicitud
   * @param {Array} attachments - Archivos adjuntos opcionales
   * @returns {Promise<Object>} Solicitud creada
   */
  async create(data, attachments = []) {
    try {
      // Si hay archivos adjuntos, usar FormData
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        
        // Agregar campos de texto
        Object.keys(data).forEach(key => {
          if (key !== 'attachments') {
            formData.append(key, data[key]);
          }
        });
        
        // Agregar archivos
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
        
        const response = await api.post('/requests', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        toast.success('Solicitud creada exitosamente');
        return response.data;
      } else {
        // Sin archivos, enviar como JSON normal
        const response = await api.post('/requests', data);
        toast.success('Solicitud creada exitosamente');
        return response.data;
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Error al crear la solicitud');
      throw error;
    }
  }

  /**
   * Actualizar el estado de una solicitud
   * @param {number} id - ID de la solicitud
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async updateStatus(id, status) {
    try {
      const response = await api.patch(`/requests/${id}`, { status });
      toast.success(`Solicitud ${status === 'approved' ? 'aprobada' : status === 'rejected' ? 'rechazada' : 'actualizada'} exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`Error updating request ${id} status:`, error);
      toast.error('Error al actualizar el estado de la solicitud');
      throw error;
    }
  }

  /**
   * Actualizar una solicitud
   * @param {number} id - ID de la solicitud
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async update(id, data) {
    try {
      const response = await api.put(`/requests/${id}`, data);
      toast.success('Solicitud actualizada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error updating request ${id}:`, error);
      toast.error('Error al actualizar la solicitud');
      throw error;
    }
  }

  /**
   * Eliminar una solicitud
   * @param {number} id - ID de la solicitud
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async delete(id) {
    try {
      if (!window.confirm('¿Está seguro de eliminar esta solicitud?')) {
        return null;
      }
      
      const response = await api.delete(`/requests/${id}`);
      toast.success('Solicitud eliminada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error deleting request ${id}:`, error);
      toast.error('Error al eliminar la solicitud');
      throw error;
    }
  }
}

export default new RequestService();