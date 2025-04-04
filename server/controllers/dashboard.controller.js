// server/controllers/dashboard.controller.js
const db = require("../models");
const User = db.users;
const Client = db.clients;
const ServicePersonnel = db.servicePersonnel;
const Request = db.requests;
const WorkOrder = db.workOrders;
const Task = db.tasks;
const Invoice = db.invoices;
const { Op } = require("sequelize");

// Obtener estadísticas para el admin
exports.getAdminStats = async (req, res) => {
  try {
    // Contar clientes
    const totalClients = await Client.count();
    
    // Contar técnicos
    const totalTechnicians = await ServicePersonnel.count();
    
    // Contar solicitudes pendientes
    const pendingRequests = await Request.count({
      where: { status: 'pending' }
    });
    
    // Contar órdenes activas
    const activeWorkOrders = await WorkOrder.count({
      where: {
        status: {
          [Op.ne]: 'completed'
        }
      }
    });
    
    // Contar tareas completadas
    const completedTasks = await Task.count({
      where: { status: 'completed' }
    });
    
    // Contar facturas pendientes
    const pendingInvoices = await Invoice.count({
      where: { status: 'pending' }
    });

    const stats = {
      totalClients,
      totalTechnicians,
      pendingRequests,
      activeWorkOrders,
      completedTasks,
      pendingInvoices
    };

    res.send(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las estadísticas de administrador."
    });
  }
};

// Obtener estadísticas para un usuario específico
exports.getUserStats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).send({
        message: `Usuario con id=${userId} no encontrado.`
      });
    }

    let stats = {};

    if (user.role === 'client') {
      // Encontrar cliente asociado
      const client = await Client.findOne({
        where: { user_id: userId }
      });
      
      if (client) {
        // Estadísticas para cliente
        const totalRequests = await Request.count({
          where: { client_id: client.id }
        });
        
        const activeWorkOrders = await WorkOrder.count({
          include: [{
            model: Request,
            where: { client_id: client.id }
          }],
          where: {
            status: {
              [Op.ne]: 'completed'
            }
          }
        });
        
        const pendingInvoices = await Invoice.count({
          where: {
            client_id: client.id,
            status: 'pending'
          }
        });
        
        stats = {
          totalRequests,
          activeWorkOrders,
          pendingInvoices
        };
      }
    } else if (user.role === 'technician') {
      // Encontrar técnico asociado
      const technician = await ServicePersonnel.findOne({
        where: { user_id: userId }
      });
      
      if (technician) {
        // Estadísticas para técnico
        const assignedWorkOrders = await WorkOrder.count({
          where: { assigned_to: technician.id }
        });
        
        const pendingTasks = await Task.count({
          include: [{
            model: WorkOrder,
            where: { assigned_to: technician.id }
          }],
          where: {
            status: {
              [Op.ne]: 'completed'
            }
          }
        });
        
        const completedTasks = await Task.count({
          include: [{
            model: WorkOrder,
            where: { assigned_to: technician.id }
          }],
          where: { status: 'completed' }
        });
        
        stats = {
          assignedWorkOrders,
          pendingTasks,
          completedTasks
        };
      }
    }

    res.send(stats);
  } catch (error) {
    console.error(`Error fetching user stats for ${userId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las estadísticas para el usuario ${userId}.`
    });
  }
};