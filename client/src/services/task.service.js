// client/src/services/task.service.js
import api from '../utils/axios';
import { toast } from 'react-toastify';

class TaskService {
  /**
   * Obtener todas las tareas
   * @returns {Promise<Array>} Lista de tareas
   */
  async getAll() {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  /**
   * Obtener tareas por orden de trabajo
   * @param {number} workOrderId - ID de la orden de trabajo
   * @returns {Promise<Array>} Lista de tareas de la orden
   */
  async getByWorkOrder(workOrderId) {
    try {
      const response = await api.get(`/tasks/work-order/${workOrderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for work order ${workOrderId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener tareas por técnico
   * @param {number} technicianId - ID del técnico
   * @returns {Promise<Array>} Lista de tareas del técnico
   */
  async getByTechnician(technicianId) {
    try {
      const response = await api.get(`/tasks/technician/${technicianId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for technician ${technicianId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener una tarea específica
   * @param {number} id - ID de la tarea
   * @returns {Promise<Object>} Datos de la tarea
   */
  async getById(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear una nueva tarea
   * @param {Object} data - Datos de la tarea
   * @returns {Promise<Object>} Tarea creada
   */
  async create(data) {
    try {
      const response = await api.post('/tasks', data);
      toast.success('Tarea creada exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error al crear la tarea');
      throw error;
    }
  }

  /**
   * Actualizar el estado de una tarea
   * @param {number} id - ID de la tarea
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async updateStatus(id, status) {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status });
      const statusText = status === 'in_progress' ? 'iniciada' : 
                         status === 'completed' ? 'completada' : 'actualizada';
      toast.success(`Tarea ${statusText} exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id} status:`, error);
      toast.error('Error al actualizar el estado de la tarea');
      throw error;
    }
  }

  /**
   * Actualizar una tarea
   * @param {number} id - ID de la tarea
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async update(id, data) {
    try {
      const response = await api.put(`/tasks/${id}`, data);
      toast.success('Tarea actualizada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      toast.error('Error al actualizar la tarea');
      throw error;
    }
  }

  /**
   * Eliminar una tarea
   * @param {number} id - ID de la tarea
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async delete(id) {
    try {
      if (!window.confirm('¿Está seguro de eliminar esta tarea?')) {
        return null;
      }
      
      const response = await api.delete(`/tasks/${id}`);
      toast.success('Tarea eliminada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      toast.error('Error al eliminar la tarea');
      throw error;
    }
  }
}

export default new TaskService();