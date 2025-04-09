// client/src/services/dashboard.service.js
import api from '../utils/axios';

class DashboardService {
  /**
   * Obtener estadísticas para el administrador
   * @returns {Promise<Object>} Estadísticas del administrador
   */
  async getAdminStats() {
    try {
      const response = await api.get('/dashboard/admin-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas para un usuario específico
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Estadísticas del usuario
   */
  async getUserStats(userId) {
    try {
      const response = await api.get(`/dashboard/user-stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user stats for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Generar datos de ejemplo para el gráfico de líneas
   * @returns {Array} Datos para el gráfico
   */
  generateMockWeeklyData() {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map(day => ({
      name: day,
      solicitudes: Math.floor(Math.random() * 10),
      ordenes: Math.floor(Math.random() * 8)
    }));
  }

  /**
   * Generar datos de ejemplo para el gráfico de distribución de estados
   * @returns {Array} Datos para el gráfico
   */
  generateMockStatusDistribution() {
    return [
      { name: 'Pendientes', value: Math.floor(Math.random() * 30) + 10 },
      { name: 'En Progreso', value: Math.floor(Math.random() * 40) + 20 },
      { name: 'Completadas', value: Math.floor(Math.random() * 50) + 30 }
    ];
  }

  /**
   * Obtener todos los datos para el dashboard según el rol
   * @param {string} role - Rol del usuario
   * @param {number} userId - ID del usuario
   * @param {number} clientId - ID del cliente (opcional)
   * @param {number} technicianId - ID del técnico (opcional)
   * @returns {Promise<Object>} Datos del dashboard
   */
  async getDashboardData(role, userId, clientId = null, technicianId = null) {
    try {
      // Objeto para almacenar los resultados
      const data = {
        stats: {},
        recentRequests: [],
        recentWorkOrders: [],
        pendingInvoices: [],
        upcomingMaintenance: []
      };

      // Obtener estadísticas según el rol
      const statsEndpoint = role === 'admin' 
        ? '/dashboard/admin-stats' 
        : `/dashboard/user-stats/${userId}`;
        
      const statsResponse = await api.get(statsEndpoint);
      data.stats = {
        ...statsResponse.data,
        // Añadir datos de gráficos de ejemplo
        weeklyStats: this.generateMockWeeklyData(),
        statusDistribution: this.generateMockStatusDistribution()
      };

      // Determinar endpoints según el rol
      let requestsEndpoint, workOrdersEndpoint, invoicesEndpoint, maintenanceEndpoint;
      
      if (role === 'admin') {
        requestsEndpoint = '/requests/recent';
        workOrdersEndpoint = '/work-orders/recent';
        invoicesEndpoint = '/invoices/pending';
        maintenanceEndpoint = '/calendar/upcoming';
      } else if (role === 'client' && clientId) {
        requestsEndpoint = `/requests/client/${clientId}/recent`;
        workOrdersEndpoint = null;
        invoicesEndpoint = `/invoices/client/${clientId}/pending`;
        maintenanceEndpoint = `/calendar/client/${clientId}/upcoming`;
      } else if (role === 'technician' && technicianId) {
        requestsEndpoint = null;
        workOrdersEndpoint = `/work-orders/technician/${technicianId}/recent`;
        invoicesEndpoint = null;
        maintenanceEndpoint = `/calendar/technician/${technicianId}/upcoming`;
      }

      // Realizar solicitudes en paralelo
      const promises = [];
      
      if (requestsEndpoint) {
        promises.push(
          api.get(requestsEndpoint)
            .then(res => { data.recentRequests = res.data; })
            .catch(err => { console.error('Error fetching recent requests:', err); })
        );
      }
      
      if (workOrdersEndpoint) {
        promises.push(
          api.get(workOrdersEndpoint)
            .then(res => { data.recentWorkOrders = res.data; })
            .catch(err => { console.error('Error fetching recent work orders:', err); })
        );
      }
      
      if (invoicesEndpoint) {
        promises.push(
          api.get(invoicesEndpoint)
            .then(res => { data.pendingInvoices = res.data; })
            .catch(err => { console.error('Error fetching pending invoices:', err); })
        );
      }
      
      if (maintenanceEndpoint) {
        promises.push(
          api.get(maintenanceEndpoint)
            .then(res => { data.upcomingMaintenance = res.data; })
            .catch(err => { console.error('Error fetching upcoming maintenance:', err); })
        );
      }

      // Esperar a que se completen todas las solicitudes
      await Promise.all(promises);
      
      return data;
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

export default new DashboardService();