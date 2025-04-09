// server/seeders/index.js
const db = require('../models');
const bcrypt = require('bcryptjs');

// Función principal para poblar la base de datos
async function seed() {
  console.log('Iniciando población de base de datos con datos de ejemplo...');
  
  try {
    // Limpiar tablas existentes (opcional, comentar si no se desea limpiar)
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.tasks.destroy({ truncate: true, force: true });
    await db.workOrders.destroy({ truncate: true, force: true });
    await db.requests.destroy({ truncate: true, force: true });
    await db.invoices.destroy({ truncate: true, force: true });
    await db.calendarEvents.destroy({ truncate: true, force: true });
    await db.quotes.destroy({ truncate: true, force: true });
    await db.attachments.destroy({ truncate: true, force: true });
    await db.notifications.destroy({ truncate: true, force: true });
    await db.servicePersonnel.destroy({ truncate: true, force: true });
    await db.clients.destroy({ truncate: true, force: true });
    await db.users.destroy({ truncate: true, force: true });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Base de datos limpiada correctamente');
    
    // Crear usuarios
    console.log('Creando usuarios...');
    const admin = await db.users.create({
      username: 'admin',
      password: bcrypt.hashSync('admin123', 8),
      email: 'admin@example.com',
      phone: '+34 666 777 888',
      role: 'admin'
    });
    
    const clientUser1 = await db.users.create({
      username: 'cliente1',
      password: bcrypt.hashSync('password', 8),
      email: 'cliente1@example.com',
      phone: '+34 611 222 333',
      role: 'client'
    });
    
    const clientUser2 = await db.users.create({
      username: 'cliente2',
      password: bcrypt.hashSync('password', 8),
      email: 'cliente2@example.com',
      phone: '+34 622 333 444',
      role: 'client'
    });
    
    const techUser1 = await db.users.create({
      username: 'tecnico1',
      password: bcrypt.hashSync('password', 8),
      email: 'tecnico1@example.com',
      phone: '+34 633 444 555',
      role: 'technician'
    });
    
    const techUser2 = await db.users.create({
      username: 'tecnico2',
      password: bcrypt.hashSync('password', 8),
      email: 'tecnico2@example.com',
      phone: '+34 644 555 666',
      role: 'technician'
    });
    
    // Crear clientes
    console.log('Creando clientes...');
    const client1 = await db.clients.create({
      user_id: clientUser1.id,
      name: 'Empresa ABC',
      address: 'Calle Falsa 123, Madrid',
      contact_person: 'Juan Pérez',
      phone: '+34 611 222 333',
      email: 'cliente1@example.com'
    });
    
    const client2 = await db.clients.create({
      user_id: clientUser2.id,
      name: 'Constructora XYZ',
      address: 'Avenida Principal 456, Barcelona',
      contact_person: 'María López',
      phone: '+34 622 333 444',
      email: 'cliente2@example.com'
    });
    
    // Crear técnicos
    console.log('Creando técnicos...');
    const tech1 = await db.servicePersonnel.create({
      user_id: techUser1.id,
      name: 'Antonio García',
      specialization: 'Electricista',
      phone: '+34 633 444 555',
      email: 'tecnico1@example.com',
      is_available: true
    });
    
    const tech2 = await db.servicePersonnel.create({
      user_id: techUser2.id,
      name: 'Laura Martínez',
      specialization: 'Plomería',
      phone: '+34 644 555 666',
      email: 'tecnico2@example.com',
      is_available: true
    });
    
    // Crear solicitudes
    console.log('Creando solicitudes...');
    const request1 = await db.requests.create({
      client_id: client1.id,
      title: 'Problema eléctrico en oficina',
      description: 'Las luces del área de recepción parpadean constantemente.',
      location: 'Oficina central, planta 2',
      service_type: 'electrical',
      status: 'approved',
      priority: 'high'
    });
    
    const request2 = await db.requests.create({
      client_id: client1.id,
      title: 'Goteras en el techo',
      description: 'Hay filtraciones de agua cuando llueve en la sala de reuniones.',
      location: 'Oficina central, planta 3',
      service_type: 'plumbing',
      status: 'pending',
      priority: 'medium'
    });
    
    const request3 = await db.requests.create({
      client_id: client2.id,
      title: 'Reparación de puerta',
      description: 'La puerta principal no cierra correctamente.',
      location: 'Entrada principal',
      service_type: 'carpentry',
      status: 'approved',
      priority: 'low'
    });
    
    // Crear órdenes de trabajo
    console.log('Creando órdenes de trabajo...');
    const workOrder1 = await db.workOrders.create({
      request_id: request1.id,
      assigned_to: tech1.id,
      title: 'Revisión del sistema eléctrico',
      description: 'Revisar sistema eléctrico de la planta 2 por problemas de parpadeo en las luces.',
      status: 'in_progress',
      scheduled_date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000) // 2 días después
    });
    
    const workOrder2 = await db.workOrders.create({
      request_id: request3.id,
      assigned_to: tech2.id,
      title: 'Reparación de puerta principal',
      description: 'Inspeccionar y reparar la puerta principal que no cierra correctamente.',
      status: 'pending',
      scheduled_date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000) // 5 días después
    });
    
    // Crear tareas
    console.log('Creando tareas...');
    const task1 = await db.tasks.create({
      work_order_id: workOrder1.id,
      description: 'Revisión del cuadro eléctrico',
      estimated_time: 60, // 60 minutos
      status: 'completed',
      start_time: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 horas antes
      end_time: new Date(new Date().getTime() - 1 * 60 * 60 * 1000) // 1 hora antes
    });
    
    const task2 = await db.tasks.create({
      work_order_id: workOrder1.id,
      description: 'Cambio de cables defectuosos',
      estimated_time: 120, // 120 minutos
      status: 'in_progress',
      start_time: new Date() // Ahora
    });
    
    const task3 = await db.tasks.create({
      work_order_id: workOrder1.id,
      description: 'Prueba final del sistema',
      estimated_time: 30, // 30 minutos
      status: 'pending'
    });
    
    const task4 = await db.tasks.create({
      work_order_id: workOrder2.id,
      description: 'Inspección del marco de la puerta',
      estimated_time: 45, // 45 minutos
      status: 'pending'
    });
    
    const task5 = await db.tasks.create({
      work_order_id: workOrder2.id,
      description: 'Reemplazo de bisagras',
      estimated_time: 90, // 90 minutos
      status: 'pending'
    });
    
    // Crear facturas
    console.log('Creando facturas...');
    const invoice1 = await db.invoices.create({
      work_order_id: workOrder1.id,
      client_id: client1.id,
      amount: 250.50,
      status: 'pending',
      due_date: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000) // 15 días después
    });
    
    // Crear eventos de calendario
    console.log('Creando eventos de calendario...');
    const event1 = await db.calendarEvents.create({
      work_order_id: workOrder1.id,
      title: 'Mantenimiento eléctrico',
      description: 'Visita para revisar el sistema eléctrico de la oficina',
      event_date: workOrder1.scheduled_date,
      end_date: new Date(workOrder1.scheduled_date.getTime() + 2 * 60 * 60 * 1000) // 2 horas después
    });
    
    const event2 = await db.calendarEvents.create({
      work_order_id: workOrder2.id,
      title: 'Reparación de puerta',
      description: 'Visita para reparar la puerta principal',
      event_date: workOrder2.scheduled_date,
      end_date: new Date(workOrder2.scheduled_date.getTime() + 3 * 60 * 60 * 1000) // 3 horas después
    });
    
    // Crear cotizaciones
    console.log('Creando cotizaciones...');
    const quote1 = await db.quotes.create({
      request_id: request1.id,
      description: 'Cotización para reparación eléctrica',
      items: JSON.stringify([
        { description: 'Revisión del sistema eléctrico', quantity: 1, unit_price: 100 },
        { description: 'Reemplazo de cables defectuosos', quantity: 10, unit_price: 15 },
        { description: 'Mano de obra', quantity: 3, unit_price: 50 }
      ]),
      total: 300,
      status: 'approved'
    });
    
    const quote2 = await db.quotes.create({
      request_id: request3.id,
      description: 'Cotización para reparación de puerta',
      items: JSON.stringify([
        { description: 'Bisagras nuevas', quantity: 3, unit_price: 25 },
        { description: 'Cerradura de seguridad', quantity: 1, unit_price: 75 },
        { description: 'Mano de obra', quantity: 2, unit_price: 45 }
      ]),
      total: 240,
      status: 'pending'
    });
    
    // Crear notificaciones
    console.log('Creando notificaciones...');
    const notification1 = await db.notifications.create({
      user_id: clientUser1.id,
      title: 'Solicitud aprobada',
      message: 'Su solicitud "Problema eléctrico en oficina" ha sido aprobada.',
      is_read: false,
      type: 'request'
    });
    
    const notification2 = await db.notifications.create({
      user_id: techUser1.id,
      title: 'Nueva orden de trabajo asignada',
      message: 'Se te ha asignado una nueva orden de trabajo: "Revisión del sistema eléctrico".',
      is_read: true,
      type: 'work_order'
    });
    
    const notification3 = await db.notifications.create({
      user_id: clientUser1.id,
      title: 'Factura pendiente',
      message: 'Tiene una factura pendiente de pago por $250.50.',
      is_read: false,
      type: 'invoice'
    });
    
    console.log('Base de datos poblada exitosamente con datos de ejemplo.');
    
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    // Cerrar la conexión
    await db.sequelize.close();
  }
}

// Ejecutar la función de población
seed().then(() => {
  console.log('Proceso de población completado.');
  process.exit(0);
}).catch(error => {
  console.error('Error en el proceso de población:', error);
  process.exit(1);
});