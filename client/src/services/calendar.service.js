// client/src/services/calendar.service.js
import api from '../utils/axios';
import { toast } from 'react-toastify';

class CalendarService {
  /**
   * Obtener todos los eventos del calendario
   * @returns {Promise<Array>} Lista de eventos
   */
  async getAll() {
    try {
      const response = await api.get('/calendar');
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Obtener eventos próximos
   * @returns {Promise<Array>} Lista de eventos próximos
   */
  async getUpcoming() {
    try {
      const response = await api.get('/calendar/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }

  /**
   * Obtener eventos próximos para un cliente
   * @param {number} clientId - ID del cliente
   * @returns {Promise<Array>} Lista de eventos del cliente
   */
  async getUpcomingByClient(clientId) {
    try {
      const response = await api.get(`/calendar/client/${clientId}/upcoming`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching upcoming events for client ${clientId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener eventos próximos para un técnico
   * @param {number} technicianId - ID del técnico
   * @returns {Promise<Array>} Lista de eventos del técnico
   */
  async getUpcomingByTechnician(technicianId) {
    try {
      const response = await api.get(`/calendar/technician/${technicianId}/upcoming`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching upcoming events for technician ${technicianId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener un evento específico
   * @param {number} id - ID del evento
   * @returns {Promise<Object>} Datos del evento
   */
  async getById(id) {
    try {
      const response = await api.get(`/calendar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching calendar event ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo evento
   * @param {Object} data - Datos del evento
   * @returns {Promise<Object>} Evento creado
   */
  async create(data) {
    try {
      const response = await api.post('/calendar', data);
      toast.success('Evento creado exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      toast.error('Error al crear el evento');
      throw error;
    }
  }

  /**
   * Actualizar un evento existente
   * @param {number} id - ID del evento
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async update(id, data) {
    try {
      const response = await api.put(`/calendar/${id}`, data);
      toast.success('Evento actualizado exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error updating calendar event ${id}:`, error);
      toast.error('Error al actualizar el evento');
      throw error;
    }
  }

  /**
   * Eliminar un evento
   * @param {number} id - ID del evento
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async delete(id) {
    try {
      if (!window.confirm('¿Está seguro de eliminar este evento?')) {
        return null;
      }
      
      const response = await api.delete(`/calendar/${id}`);
      toast.success('Evento eliminado exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error deleting calendar event ${id}:`, error);
      toast.error('Error al eliminar el evento');
      throw error;
    }
  }
}

export default new CalendarService();