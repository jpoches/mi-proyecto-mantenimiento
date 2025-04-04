// client/src/utils/formatters.js

/**
 * Funciones de utilidad para formateo en el cliente
 */

// Formatear fecha para mostrar
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return '-';
    
    const defaultOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Date(dateString).toLocaleDateString(undefined, mergedOptions);
  };
  
  // Formatear fecha y hora
  export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Formatear moneda
  export const formatCurrency = (amount, currency = 'MXN') => {
    if (amount === undefined || amount === null) return '-';
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  // Truncar texto largo
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  };
  
  // Formatear estado de solicitud
  export const formatRequestStatus = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada'
    };
    
    return statusMap[status] || status;
  };
  
  // Formatear estado de orden de trabajo
  export const formatWorkOrderStatus = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      completed: 'Completada'
    };
    
    return statusMap[status] || status;
  };
  
  // Formatear estado de factura
  export const formatInvoiceStatus = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      paid: 'Pagada'
    };
    
    return statusMap[status] || status;
  };
  
  // Obtener color según estado
  export const getStatusColor = (status, type = 'request') => {
    const colorMap = {
      request: {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
      },
      workOrder: {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800'
      },
      invoice: {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800'
      },
      task: {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800'
      }
    };
    
    return colorMap[type]?.[status] || 'bg-gray-100 text-gray-800';
  };
  
  // Formatear tiempo en minutos
  export const formatMinutes = (minutes) => {
    if (!minutes && minutes !== 0) return '-';
    
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} h`;
    }
    
    return `${hours} h ${remainingMinutes} min`;
  };