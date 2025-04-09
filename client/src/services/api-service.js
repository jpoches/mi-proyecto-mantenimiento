// src/services/api-service.js
import axios from '../utils/axios';
import { API_URL } from '../config/api';

// Servicio para clientes
export const clientService = {
  getAll: async () => {
    try {
      const response = await axios.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await axios.post('/clients', data);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.put(`/clients/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  }
};

// Servicio para personal de servicio
export const servicePersonnelService = {
  getAll: async () => {
    try {
      const response = await axios.get('/service-personnel');
      return response.data;
    } catch (error) {
      console.error('Error fetching service personnel:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`/service-personnel/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service personnel ${id}:`, error);
      throw error;
    }
  },

  getAvailable: async () => {
    try {
      const response = await axios.get('/service-personnel/available');
      return response.data;
    } catch (error) {
      console.error('Error fetching available service personnel:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await axios.post('/service-personnel', data);
      return response.data;
    } catch (error) {
      console.error('Error creating service personnel:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.put(`/service-personnel/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating service personnel ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`/service-personnel/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting service personnel ${id}:`, error);
      throw error;
    }
  }
};

// Servicio para solicitudes
export const requestService = {
  getAll: async () => {
    try {
      const response = await axios.get('/requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching request ${id}:`, error);
      throw error;
    }
  },

  getRecent: async () => {
    try {
      const response = await axios.get('/requests/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent requests:', error);
      throw error;
    }
  },

  getRecentByClient: async (clientId) => {
    try {
      const response = await axios.get(`/requests/client/${clientId}/recent`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recent requests for client ${clientId}:`, error);
      throw error;
    }
  },

  getByClient: async (clientId) => {
    try {
      const response = await axios.get(`/requests/client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching requests for client ${clientId}:`, error);
      throw error;
    }
  },

  create: async (data, attachments = []) => {
    try {
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        
        // Agregar datos de la solicitud
        Object.keys(data).forEach(key => {
          if (key !== 'attachments') {
            formData.append(key, data[key]);
          }
        });
        
        // Agregar archivos adjuntos
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
        
        const response = await axios.post('/requests', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data;
      } else {
        const response = await axios.post('/requests', data);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await axios.patch(`/requests/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating request ${id} status:`, error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.put(`/requests/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating request ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting request ${id}:`, error);
      throw error;
    }
  }
};

// Servicio para órdenes de trabajo
export const workOrderService = {
  getAll: async () => {
    try {
      const response = await axios.get('/work-orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching work orders:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`/work-orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching work order ${id}:`, error);
      throw error;
    }
  },

  getRecent: async () => {
    try {
      const response = await axios.get('/work-orders/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent work orders:', error);
      throw error;
    }
  },

  getRecentByTechnician: async (technicianId) => {
    try {
      const response = await axios.get(`/work-orders/technician/${technicianId}/recent`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recent work orders for technician ${technicianId}:`, error);
      throw error;
    }
  },

  getByTechnician: async (technicianId) => {
    try {
      const response = await axios.get(`/work-orders/technician/${technicianId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching work orders for technician ${technicianId}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await axios.post('/work-orders', data);
      return response.data;
    } catch (error) {
      console.error('Error creating work order:', error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await axios.patch(`/work-orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating work order ${id} status:`, error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.put(`/work-orders/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating work order ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`/work-orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting work order ${id}:`, error);
      throw error;
    }
  }
};

// Exportación por defecto como un objeto que contiene todos los servicios
export default {
  clientService,
  servicePersonnelService,
  requestService,
  workOrderService
};