// client/src/services/invoice.service.js
import api from '../utils/axios';
import { toast } from 'react-toastify';

class InvoiceService {
  /**
   * Obtener todas las facturas
   * @returns {Promise<Array>} Lista de facturas
   */
  async getAll() {
    try {
      const response = await api.get('/invoices');
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  /**
   * Obtener facturas pendientes
   * @returns {Promise<Array>} Lista de facturas pendientes
   */
  async getPending() {
    try {
      const response = await api.get('/invoices/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending invoices:', error);
      throw error;
    }
  }

  /**
   * Obtener facturas por cliente
   * @param {number} clientId - ID del cliente
   * @returns {Promise<Array>} Lista de facturas del cliente
   */
  async getByClient(clientId) {
    try {
      const response = await api.get(`/invoices/client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoices for client ${clientId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener facturas pendientes por cliente
   * @param {number} clientId - ID del cliente
   * @returns {Promise<Array>} Lista de facturas pendientes del cliente
   */
  async getPendingByClient(clientId) {
    try {
      const response = await api.get(`/invoices/client/${clientId}/pending`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pending invoices for client ${clientId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener facturas por orden de trabajo
   * @param {number} workOrderId - ID de la orden
   * @returns {Promise<Array>} Lista de facturas de la orden
   */
  async getByWorkOrder(workOrderId) {
    try {
      const response = await api.get(`/invoices/work-order/${workOrderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoices for work order ${workOrderId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener una factura específica
   * @param {number} id - ID de la factura
   * @returns {Promise<Object>} Datos de la factura
   */
  async getById(id) {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear una nueva factura
   * @param {Object} data - Datos de la factura
   * @returns {Promise<Object>} Factura creada
   */
  async create(data) {
    try {
      const response = await api.post('/invoices', data);
      toast.success('Factura creada exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Error al crear la factura');
      throw error;
    }
  }

  /**
   * Actualizar el estado de una factura
   * @param {number} id - ID de la factura
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async updateStatus(id, status) {
    try {
      const response = await api.patch(`/invoices/${id}/status`, { status });
      toast.success(`Factura marcada como ${status === 'paid' ? 'pagada' : 'pendiente'} exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ${id} status:`, error);
      toast.error('Error al actualizar el estado de la factura');
      throw error;
    }
  }

  /**
   * Actualizar una factura
   * @param {number} id - ID de la factura
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async update(id, data) {
    try {
      const response = await api.put(`/invoices/${id}`, data);
      toast.success('Factura actualizada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ${id}:`, error);
      toast.error('Error al actualizar la factura');
      throw error;
    }
  }

  /**
   * Eliminar una factura
   * @param {number} id - ID de la factura
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async delete(id) {
    try {
      if (!window.confirm('¿Está seguro de eliminar esta factura?')) {
        return null;
      }
      
      const response = await api.delete(`/invoices/${id}`);
      toast.success('Factura eliminada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error deleting invoice ${id}:`, error);
      toast.error('Error al eliminar la factura');
      throw error;
    }
  }
}

export default new InvoiceService();