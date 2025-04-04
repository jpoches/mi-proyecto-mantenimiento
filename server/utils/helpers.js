// server/utils/helpers.js

/**
 * Funciones de utilidad para el servidor
 */

// Formatear fecha para respuestas de API
exports.formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString();
  };
  
  // Parsear parámetros de consulta para paginación
  exports.getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };
  
  // Preparar respuesta paginada
  exports.getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, items, totalPages, currentPage };
  };
  
  // Generar un código único para órdenes de trabajo
  exports.generateWorkOrderCode = () => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `WO-${year}${month}${day}-${random}`;
  };
  
  // Calcular fechas
  exports.getDateRange = (range) => {
    const today = new Date();
    const start = new Date();
    
    switch (range) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(today.getFullYear() - 1);
        break;
      default:
        start.setHours(0, 0, 0, 0);
    }
    
    return { start, end: today };
  };