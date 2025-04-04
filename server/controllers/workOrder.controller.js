// server/controllers/workOrder.controller.js
const db = require("../models");
const WorkOrder = db.workOrders;
const Request = db.requests;
const ServicePersonnel = db.servicePersonnel;
const Task = db.tasks;
const Client = db.clients;
const CalendarEvent = db.calendarEvents;
const Notification = db.notifications;
const { Op } = require("sequelize");

// Crear y guardar una nueva orden de trabajo
exports.create = async (req, res) => {
  try {
    // Validar la solicitud
    if (!req.body.title) {
      return res.status(400).send({
        message: "El título no puede estar vacío."
      });
    }

    if (!req.body.assigned_to) {
      return res.status(400).send({
        message: "Se debe asignar a un técnico."
      });
    }

    // Crear una orden de trabajo
    const workOrder = {
      request_id: req.body.request_id,
      assigned_to: req.body.assigned_to,
      title: req.body.title,
      description: req.body.description,
      status: "pending",
      scheduled_date: req.body.scheduled_date || new Date()
    };

    // Guardar la orden en la base de datos
    const createdWorkOrder = await WorkOrder.create(workOrder);

    // Si hay tareas, crearlas
    if (req.body.tasks && Array.isArray(req.body.tasks) && req.body.tasks.length > 0) {
      const tasks = req.body.tasks.map(task => ({
        work_order_id: createdWorkOrder.id,
        description: task.description,
        estimated_time: task.estimated_time,
        status: "pending"
      }));

      await Task.bulkCreate(tasks);
    }

    // Crear un evento en el calendario
    await CalendarEvent.create({
      work_order_id: createdWorkOrder.id,
      title: `Orden de trabajo: ${workOrder.title}`,
      description: workOrder.description,
      event_date: workOrder.scheduled_date,
      end_date: new Date(new Date(workOrder.scheduled_date).getTime() + 3600000) // 1 hora después
    });

    // Si viene de una solicitud, actualizar el estado de la solicitud
    if (req.body.request_id) {
      const request = await Request.findByPk(req.body.request_id, {
        include: [
          {
            model: Client,
            attributes: ["id", "user_id"]
          }
        ]
      });

      // Notificar al cliente
      if (request && request.client) {
        await Notification.create({
          user_id: request.client.user_id,
          title: "Nueva orden de trabajo",
          message: `Se ha creado una orden de trabajo para su solicitud: ${request.title}`,
          type: "work_order"
        });
      }
    }

    // Notificar al técnico asignado
    const technician = await ServicePersonnel.findByPk(req.body.assigned_to);
    if (technician) {
      await Notification.create({
        user_id: technician.user_id,
        title: "Nueva asignación",
        message: `Se le ha asignado una nueva orden de trabajo: ${workOrder.title}`,
        type: "work_order"
      });
    }

    // Buscar técnico y solicitud para incluir en la respuesta
    const orderWithRelations = await WorkOrder.findByPk(createdWorkOrder.id, {
      include: [
        {
          model: ServicePersonnel,
          attributes: ["id", "name", "specialization"]
        },
        {
          model: Request,
          include: [
            {
              model: Client,
              attributes: ["id", "name"]
            }
          ]
        },
        {
          model: Task
        }
      ]
    });

    res.status(201).send(orderWithRelations);
  } catch (error) {
    console.error("Error creating work order:", error);
    res.status(500).send({
      message: error.message || "Error al crear la orden de trabajo."
    });
  }
};

// Obtener todas las órdenes de trabajo
exports.findAll = async (req, res) => {
  try {
    const workOrders = await WorkOrder.findAll({
      include: [
        {
          model: ServicePersonnel,
          attributes: ["id", "name", "specialization"]
        },
        {
          model: Request,
          include: [
            {
              model: Client,
              attributes: ["id", "name"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(workOrders);
  } catch (error) {
    console.error("Error fetching work orders:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las órdenes de trabajo."
    });
  }
};

// Obtener órdenes de trabajo recientes
exports.findRecent = async (req, res) => {
  try {
    const workOrders = await WorkOrder.findAll({
      include: [
        {
          model: ServicePersonnel,
          attributes: ["id", "name", "specialization"]
        },
        {
          model: Request,
          include: [
            {
              model: Client,
              attributes: ["id", "name"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]],
      limit: 5
    });
    res.send(workOrders);
  } catch (error) {
    console.error("Error fetching recent work orders:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las órdenes de trabajo recientes."
    });
  }
};

// Obtener órdenes de trabajo activas
exports.findActive = async (req, res) => {
  try {
    const workOrders = await WorkOrder.findAll({
      where: {
        status: {
          [Op.ne]: "completed"
        }
      },
      include: [
        {
          model: ServicePersonnel,
          attributes: ["id", "name", "specialization"]
        },
        {
          model: Request,
          include: [
            {
              model: Client,
              attributes: ["id", "name"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(workOrders);
  } catch (error) {
    console.error("Error fetching active work orders:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las órdenes de trabajo activas."
    });
  }
};

// Encontrar todas las órdenes de trabajo de un técnico
exports.findAllByTechnician = async (req, res) => {
  const technicianId = req.params.technicianId;

  try {
    const workOrders = await WorkOrder.findAll({
      where: { assigned_to: technicianId },
      include: [
        {
          model: ServicePersonnel,
          attributes: ["id", "name", "specialization"]
        },
        {
          model: Request,
          include: [
            {
              model: Client,
              attributes: ["id", "name"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(workOrders);
  } catch (error) {
    console.error(`Error fetching work orders for technician ${technicianId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las órdenes del técnico ${technicianId}.`
    });
  }
};

// Encontrar órdenes de trabajo recientes de un técnico
exports.findRecentByTechnician = async (req, res) => {
  const technicianId = req.params.technicianId;

  try {
    const workOrders = await WorkOrder.findAll({
      where: { assigned_to: technicianId },
      include: [
        {
          model: ServicePersonnel,
          attributes: ["id", "name", "specialization"]
        },
        {
          model: Request,
          include: [
            {
              model: Client,
              attributes: ["id", "name"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]],
      limit: 5
    });
    res.send(workOrders);
  } catch (error) {
    console.error(`Error fetching recent work orders for technician ${technicianId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las órdenes recientes del técnico ${technicianId}.`
    });
  }
};

// Encontrar órdenes de trabajo activas de un técnico
exports.findActiveByTechnician = async (req, res) => {
  const technicianId = req.params.technicianId;

  try {
    const workOrders = await WorkOrder.findAll({
      where: { 
        assigned_to: technicianId,
        status: {
          [Op.ne]: "completed"
        }
      },
      include: [
        {
          model: ServicePersonnel,
          attributes: ["id", "name", "specialization"]
        },
        {
          model: Request,
          include: [
            {
              model: Client,
              attributes: ["id", "name"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(workOrders);
  } catch (error) {
    console.error(`Error fetching active work orders for technician ${technicianId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las órdenes activas del técnico ${technicianId}.`
    });
  }
};

// Encontrar una orden de trabajo por ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const workOrder = await WorkOrder.findByPk(id, {
      include: [
        {
          model: ServicePersonnel,
          attributes: ["id", "name", "specialization", "phone", "email"]
        },
        {
          model: Request,
          include: [
            {
              model: Client,
              attributes: ["id", "name", "address", "phone", "email"]
            }
          ]
        },
        {
          model: Task
        }
      ]
    });

    if (!workOrder) {
      return res.status(404).send({
        message: `Orden de trabajo con id=${id} no encontrada.`
      });
    }

    res.send(workOrder);
  } catch (error) {
    console.error(`Error fetching work order ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar la orden con id=${id}.`
    });
  }
};

// Actualizar el estado de una orden de trabajo
exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    // Validar estado
    if (!status || !["pending", "in_progress", "completed"].includes(status)) {
      return res.status(400).send({
        message: "Estado inválido."
      });
    }

    const workOrder = await WorkOrder.findByPk(id, {
      include: [
        {
          model: ServicePersonnel,
          attributes: ["id", "user_id", "name"]
        },
        {
          model: Request,
          include: [
            {
              model: Client,
              attributes: ["id", "user_id", "name"]
            }
          ]
        }
      ]
    });

    if (!workOrder) {
      return res.status(404).send({
        message: `Orden de trabajo con id=${id} no encontrada.`
      });
    }

    // Actualizar datos según el estado
    const updateData = { status };

    if (status === "completed") {
      updateData.completed_date = new Date();
    }

    const [num] = await WorkOrder.update(updateData, {
      where: { id: id }
    });

    if (num === 1) {
      // Enviar notificaciones
      if (workOrder.request && workOrder.request.client) {
        await Notification.create({
          user_id: workOrder.request.client.user_id,
          title: "Actualización de orden de trabajo",
          message: `Su orden de trabajo ${workOrder.title} ha sido actualizada a: ${status === "pending" ? "Pendiente" : status === "in_progress" ? "En progreso" : "Completada"}`,
          type: "work_order"
        });
      }

      res.send({
        message: "El estado de la orden se actualizó exitosamente."
      });
    } else {
      res.status(500).send({
        message: `No se pudo actualizar el estado de la orden con id=${id}.`
      });
    }
  } catch (error) {
    console.error(`Error updating work order status ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar el estado de la orden con id=${id}.`
    });
  }
};

// Actualizar una orden de trabajo
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await WorkOrder.update(req.body, {
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "La orden de trabajo se actualizó exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo actualizar la orden de trabajo con id=${id}. Tal vez la orden no existe o el cuerpo de la solicitud está vacío.`
      });
    }
  } catch (error) {
    console.error(`Error updating work order ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar la orden de trabajo con id=${id}.`
    });
  }
};

// Eliminar una orden de trabajo
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await WorkOrder.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "La orden de trabajo se eliminó exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo eliminar la orden de trabajo con id=${id}. Tal vez la orden no existe.`
      });
    }
  } catch (error) {
    console.error(`Error deleting work order ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar la orden de trabajo con id=${id}.`
    });
  }
};