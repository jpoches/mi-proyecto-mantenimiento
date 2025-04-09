// src/utils/formatters.js

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

// Formatear tiempo relativo (hace X minutos, horas, etc.)
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '-';
  
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);
  
  if (diffSec < 60) {
    return 'Hace unos segundos';
  } else if (diffMin < 60) {
    return `Hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHour < 24) {
    return `Hace ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
  } else if (diffDay < 30) {
    return `Hace ${diffDay} ${diffDay === 1 ? 'día' : 'días'}`;
  } else if (diffMonth < 12) {
    return `Hace ${diffMonth} ${diffMonth === 1 ? 'mes' : 'meses'}`;
  } else {
    return `Hace ${diffYear} ${diffYear === 1 ? 'año' : 'años'}`;
  }
};

// Formatear moneda
export const formatCurrency = (amount, currency = 'MXN') => {
  if (amount === undefined || amount === null) return '-';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
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

// Formatear tipo de servicio
export const formatServiceType = (type) => {
  const typeMap = {
    electrical: 'Eléctrico',
    plumbing: 'Plomería',
    carpentry: 'Carpintería',
    painting: 'Pintura',
    cleaning: 'Limpieza',
    other: 'Otro'
  };
  
  return typeMap[type] || type;
};

// Formatear prioridad
export const formatPriority = (priority) => {
  const priorityMap = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  };
  
  return priorityMap[priority] || priority;
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
    },
    priority: {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
  };
  
  return colorMap[type]?.[status] || 'bg-gray-100 text-gray-800';
};

// Obtener ícono según estado
export const getStatusIcon = (status, type = 'request') => {
  // Este es un ejemplo, debes importar los íconos apropiados en el componente
  const iconMap = {
    request: {
      pending: 'FaClock',
      approved: 'FaCheck',
      rejected: 'FaTimes'
    },
    workOrder: {
      pending: 'FaClock',
      in_progress: 'FaPlay',
      completed: 'FaCheck'
    },
    task: {
      pending: 'FaClock',
      in_progress: 'FaPlay',
      completed: 'FaCheck'
    }
  };
  
  return iconMap[type]?.[status] || 'FaQuestion';
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

// Formatear tiempo transcurrido entre dos fechas
export const getElapsedTime = (startTime, endTime) => {
  if (!startTime) return null;
  
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  
  // Diferencia en milisegundos
  const diffMs = end - start;
  
  // Convertir a minutos
  const diffMinutes = Math.floor(diffMs / 60000);
  
  return formatMinutes(diffMinutes);
};

// Calcular porcentaje
export const calculatePercentage = (value, total) => {
  if (!value || !total) return 0;
  
  const percentage = (value / total) * 100;
  return Math.round(percentage);
};

// Formatear número con separador de miles
export const formatNumber = (number) => {
  if (number === undefined || number === null) return '-';
  
  return new Intl.NumberFormat('es-MX').format(number);
};

// Capitalizar texto
export const capitalize = (text) => {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};