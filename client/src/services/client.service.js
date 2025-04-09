// client/src/services/client.service.js (corregido)
import axios from '../utils/axios';
import { toast } from 'react-toastify';

class ClientService {
  /**
   * Obtener todos los clientes
   * @returns {Promise<Array>} Lista de clientes
   */
  async getAll() {
    try {
      const response = await axios.get('/clients');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Error al cargar los clientes');
      return []; // Devolver array vacío para evitar errores al aplicar filter
    }
  }

  /**
   * Obtener un cliente específico
   * @param {number} id - ID del cliente
   * @returns {Promise<Object>} Datos del cliente
   */
  async getById(id) {
    try {
      const response = await axios.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      toast.error('Error al obtener los datos del cliente');
      throw error;
    }
  }

  /**
   * Crear un nuevo cliente
   * @param {Object} data - Datos del cliente
   * @returns {Promise<Object>} Cliente creado
   */
  async create(data) {
    try {
      const response = await axios.post('/clients', data);
      toast.success('Cliente creado exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Error al crear el cliente');
      throw error;
    }
  }

  /**
   * Actualizar un cliente existente
   * @param {number} id - ID del cliente
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async update(id, data) {
    try {
      const response = await axios.put(`/clients/${id}`, data);
      toast.success('Cliente actualizado exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      toast.error('Error al actualizar el cliente');
      throw error;
    }
  }

  /**
   * Eliminar un cliente
   * @param {number} id - ID del cliente
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async delete(id) {
    try {
      if (!window.confirm('¿Está seguro de eliminar este cliente?')) {
        return null;
      }
      
      const response = await axios.delete(`/clients/${id}`);
      toast.success('Cliente eliminado exitosamente');
      return response.data;
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      toast.error('Error al eliminar el cliente');
      throw error;
    }
  }
}

export default new ClientService();