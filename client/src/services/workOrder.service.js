// client/src/services/workOrder.service.js
import api from '../utils/axios';
import { toast } from 'react-toastify';

class WorkOrderService {
  /**
   * Obtener todas las órdenes de trabajo
   * @returns {Promise<Array>} Lista de órdenes de trabajo
   */
  async getAll() {
    try {
      const response = await api.get('/work-orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching work orders:', error);
      throw error;
    }
  }

  /**
   * Obtener órdenes de trabajo recientes
   * @returns {Promise<Array>} Lista de órdenes recientes
   */
  async getRecent() {
    try {
      const response = await api.get('/work-orders/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent work orders:', error);
      throw error;
    }
  }

  /**
   * Obtener órdenes de trabajo activas
   * @returns {Promise<Array>} Lista de órdenes activas
   */
  async getActive() {
    try {
      const response = await api.get('/work-orders/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active work orders:', error);
      throw error;
    }
  }

  /**
   * Obtener órdenes de trabajo por técnico
   * @param {number} technicianId - ID del técnico
   * @returns {Promise<Array>} Lista de órdenes del técnico
   */
  async getByTechnician(technicianId) {
    try {
      const response = await api.get(`/work-orders/technician/${technicianId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching work orders for technician ${technicianId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener órdenes de trabajo recientes por técnico
   * @param {number} technicianId - ID del técnico
   * @returns {Promise<Array>} Lista de órdenes recientes del técnico
   */
  async getRecentByTechnician(technicianId) {
    try {
      const response = await api.get(`/work-orders/technician/${technicianId}/recent`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recent work orders for technician ${technicianId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener órdenes de trabajo activas por técnico
   * @param {number} technicianId - ID del técnico
   * @returns {Promise<Array>} Lista de órdenes activas del técnico
   */
  async getActiveByTechnician(technicianId) {
    try {
      const response = await api.get(`/work-orders/technician/${technicianId}/active`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching active work orders for technician ${technicianId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener una orden de trabajo específica
   * @param {number} id - ID de la orden
   * @returns {Promise<Object>} Datos de la orden
   */
  async getById(id) {
    try {
      const response = await api.get(`/work-orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching work order ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear una nueva orden de trabajo
   * @param {Object} data - Datos de la orden
   * @returns {Promise<Object>} Orden creada
   */
  async create(data) {
    try {
      const response = await api.post('/work-orders', data);
      toast.success('Orden de trabajo creada exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error creating work order:', error);
      toast.error('Error al crear la orden de trabajo');
      throw error;
    }
  }

  /**
   * Actualizar el estado de una orden de trabajo
   * @param {number} id - ID de la orden
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async updateStatus(id, status) {
    try {
      const response = await api.patch(`/work-orders/${id}/status`, { status });
      const statusText = status === 'in_progress' ? 'iniciada' : 
                         status === 'completed' ? 'completada' : 'actualizada';
      toast.success(`Orden de trabajo ${statusText} exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`Error updating work order ${id} status:`, error);
      toast.error('Error al actualizar el estado de la orden');
      throw error;
    }
  }

  /**
   * Actualizar una orden de trabajo
   * @param {number} id - ID de la orden
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async update(id, data) {
    try {
      const response = await api.put(`/work-orders/${id}`, data);
      toast.success('Orden de trabajo actualizada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error updating work order ${id}:`, error);
      toast.error('Error al actualizar la orden de trabajo');
      throw error;
    }
  }

  /**
   * Eliminar una orden de trabajo
   * @param {number} id - ID de la orden
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async delete(id) {
    try {
      if (!window.confirm('¿Está seguro de eliminar esta orden de trabajo?')) {
        return null;
      }
      
      const response = await api.delete(`/work-orders/${id}`);
      toast.success('Orden de trabajo eliminada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error deleting work order ${id}:`, error);
      toast.error('Error al eliminar la orden de trabajo');
      throw error;
    }
  }
}

export default new WorkOrderService();