// client/src/services/quote.service.js
import api from '../utils/axios';
import { toast } from 'react-toastify';

class QuoteService {
  /**
   * Obtener todas las cotizaciones
   * @returns {Promise<Array>} Lista de cotizaciones
   */
  async getAll() {
    try {
      const response = await api.get('/quotes');
      return response.data;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  }

  /**
   * Obtener una cotización específica
   * @param {number} id - ID de la cotización
   * @returns {Promise<Object>} Datos de la cotización
   */
  async getById(id) {
    try {
      const response = await api.get(`/quotes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear una nueva cotización
   * @param {Object} data - Datos de la cotización
   * @returns {Promise<Object>} Cotización creada
   */
  async create(data) {
    try {
      const response = await api.post('/quotes', data);
      toast.success('Cotización creada exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('Error al crear la cotización');
      throw error;
    }
  }

  /**
   * Actualizar el estado de una cotización
   * @param {number} id - ID de la cotización
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async updateStatus(id, status) {
    try {
      const response = await api.patch(`/quotes/${id}`, { status });
      const statusText = status === 'approved' ? 'aprobada' : 
                         status === 'rejected' ? 'rechazada' : 'actualizada';
      toast.success(`Cotización ${statusText} exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`Error updating quote ${id} status:`, error);
      toast.error('Error al actualizar el estado de la cotización');
      throw error;
    }
  }

  /**
   * Actualizar una cotización
   * @param {number} id - ID de la cotización
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async update(id, data) {
    try {
      const response = await api.put(`/quotes/${id}`, data);
      toast.success('Cotización actualizada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error updating quote ${id}:`, error);
      toast.error('Error al actualizar la cotización');
      throw error;
    }
  }

  /**
   * Eliminar una cotización
   * @param {number} id - ID de la cotización
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async delete(id) {
    try {
      if (!window.confirm('¿Está seguro de eliminar esta cotización?')) {
        return null;
      }
      
      const response = await api.delete(`/quotes/${id}`);
      toast.success('Cotización eliminada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error deleting quote ${id}:`, error);
      toast.error('Error al eliminar la cotización');
      throw error;
    }
  }
}

export default new QuoteService();