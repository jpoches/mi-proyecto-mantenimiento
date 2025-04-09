// client/src/services/notification.service.js
import api from '../utils/axios';

class NotificationService {
  /**
   * Obtener todas las notificaciones
   * @returns {Promise<Array>} Lista de notificaciones
   */
  async getAll() {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Obtener notificaciones por usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de notificaciones del usuario
   */
  async getByUser(userId) {
    try {
      const response = await api.get(`/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener notificaciones no leídas
   * @param {number} userId - ID del usuario (opcional)
   * @returns {Promise<Array>} Lista de notificaciones no leídas
   */
  async getUnread(userId = null) {
    try {
      let url = '/notifications/unread';
      if (userId) {
        url += `?userId=${userId}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  }

  /**
   * Marcar una notificación como leída
   * @param {number} id - ID de la notificación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async markAsRead(id) {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   * @param {number} userId - ID del usuario (opcional)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async markAllAsRead(userId = null) {
    try {
      const payload = userId ? { userId } : {};
      const response = await api.patch('/notifications/read-all', payload);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Eliminar una notificación
   * @param {number} id - ID de la notificación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async delete(id) {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  }
}

export default new NotificationService();