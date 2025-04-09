// client/src/services/servicePersonnel.service.js
import api from '../utils/axios';
import { toast } from 'react-toastify';

class ServicePersonnelService {
  /**
   * Obtener todo el personal técnico
   * @returns {Promise<Array>} Lista de técnicos
   */
  async getAll() {
    try {
      const response = await api.get('/service-personnel');
      return response.data;
    } catch (error) {
      console.error('Error fetching service personnel:', error);
      throw error;
    }
  }

  /**
   * Obtener técnicos disponibles
   * @returns {Promise<Array>} Lista de técnicos disponibles
   */
  async getAvailable() {
    try {
      const response = await api.get('/service-personnel/available');
      return response.data;
    } catch (error) {
      console.error('Error fetching available technicians:', error);
      throw error;
    }
  }

  /**
   * Obtener un técnico específico
   * @param {number} id - ID del técnico
   * @returns {Promise<Object>} Datos del técnico
   */
  async getById(id) {
    try {
      const response = await api.get(`/service-personnel/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching technician ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo técnico
   * @param {Object} data - Datos del técnico
   * @returns {Promise<Object>} Técnico creado
   */
  async create(data) {
    try {
      const response = await api.post('/service-personnel', data);
      toast.success('Técnico creado exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error creating technician:', error);
      toast.error('Error al crear el técnico');
      throw error;
    }
  }

  /**
   * Actualizar un técnico existente
   * @param {number} id - ID del técnico
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async update(id, data) {
    try {
      const response = await api.put(`/service-personnel/${id}`, data);
      toast.success('Técnico actualizado exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error updating technician ${id}:`, error);
      toast.error('Error al actualizar el técnico');
      throw error;
    }
  }

  /**
   * Eliminar un técnico
   * @param {number} id - ID del técnico
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async delete(id) {
    try {
      if (!window.confirm('¿Está seguro de eliminar este técnico?')) {
        return null;
      }
      
      const response = await api.delete(`/service-personnel/${id}`);
      toast.success('Técnico eliminado exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error deleting technician ${id}:`, error);
      toast.error('Error al eliminar el técnico');
      throw error;
    }
  }
}

export default new ServicePersonnelService();