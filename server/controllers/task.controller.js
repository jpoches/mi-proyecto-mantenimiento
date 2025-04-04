// server/controllers/task.controller.js
const db = require("../models");
const Task = db.tasks;
const WorkOrder = db.workOrders;
const ServicePersonnel = db.servicePersonnel;
const { Op } = require("sequelize");

// Crear y guardar una nueva tarea
exports.create = async (req, res) => {
  try {
    // Validar la solicitud
    if (!req.body.description) {
      return res.status(400).send({
        message: "La descripción no puede estar vacía."
      });
    }

    if (!req.body.work_order_id) {
      return res.status(400).send({
        message: "El ID de la orden de trabajo es requerido."
      });
    }

    // Verificar si la orden de trabajo existe
    const workOrder = await WorkOrder.findByPk(req.body.work_order_id);
    if (!workOrder) {
      return res.status(404).send({
        message: `Orden de trabajo con id=${req.body.work_order_id} no encontrada.`
      });
    }

    // Crear una tarea
    const task = {
      work_order_id: req.body.work_order_id,
      description: req.body.description,
      estimated_time: req.body.estimated_time,
      status: "pending"
    };

    // Guardar la tarea en la base de datos
    const createdTask = await Task.create(task);

    // Buscar información relacionada para incluir en la respuesta
    const taskWithWorkOrder = await Task.findByPk(createdTask.id, {
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status']
        }
      ]
    });

    res.status(201).send(taskWithWorkOrder);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send({
      message: error.message || "Error al crear la tarea."
    });
  }
};

// Obtener todas las tareas
exports.findAll = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status'],
          include: [
            {
              model: ServicePersonnel,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las tareas."
    });
  }
};

// Encontrar tareas por orden de trabajo
exports.findByWorkOrder = async (req, res) => {
  const workOrderId = req.params.workOrderId;

  try {
    const tasks = await Task.findAll({
      where: { work_order_id: workOrderId },
      order: [["created_at", "ASC"]]
    });
    res.send(tasks);
  } catch (error) {
    console.error(`Error fetching tasks for work order ${workOrderId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las tareas para la orden ${workOrderId}.`
    });
  }
};

// Encontrar tareas por técnico
exports.findByTechnician = async (req, res) => {
  const technicianId = req.params.technicianId;

  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status'],
          where: { assigned_to: technicianId },
          include: [
            {
              model: ServicePersonnel,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(tasks);
  } catch (error) {
    console.error(`Error fetching tasks for technician ${technicianId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las tareas del técnico ${technicianId}.`
    });
  }
};

// Encontrar una tarea por ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status', 'assigned_to'],
          include: [
            {
              model: ServicePersonnel,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!task) {
      return res.status(404).send({
        message: `Tarea con id=${id} no encontrada.`
      });
    }

    res.send(task);
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar la tarea con id=${id}.`
    });
  }
};

// Actualizar el estado de una tarea
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

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).send({
        message: `Tarea con id=${id} no encontrada.`
      });
    }

    // Actualizar datos según el estado
    const updateData = { status };

    // Si la tarea se inicia, registrar hora de inicio
    if (status === "in_progress" && !task.start_time) {
      updateData.start_time = new Date();
    }

    // Si la tarea se completa, registrar hora de fin
    if (status === "completed" && !task.end_time) {
      updateData.end_time = new Date();
    }

    const [num] = await Task.update(updateData, {
      where: { id: id }
    });

    if (num === 1) {
      // Verificar si todas las tareas de la orden están completadas
      if (status === "completed") {
        const workOrderId = task.work_order_id;
        const pendingTasks = await Task.findAll({
          where: {
            work_order_id: workOrderId,
            status: {
              [Op.ne]: "completed"
            }
          }
        });

        // Si no hay tareas pendientes, actualizar el estado de la orden
        if (pendingTasks.length === 0) {
          await WorkOrder.update(
            { status: "completed", completed_date: new Date() },
            { where: { id: workOrderId } }
          );
        }
      }

      res.send({
        message: "El estado de la tarea se actualizó exitosamente."
      });
    } else {
      res.status(500).send({
        message: `No se pudo actualizar el estado de la tarea con id=${id}.`
      });
    }
  } catch (error) {
    console.error(`Error updating task status ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar el estado de la tarea con id=${id}.`
    });
  }
};

// Actualizar una tarea
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Task.update(req.body, {
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Tarea actualizada exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo actualizar la tarea con id=${id}. Tal vez la tarea no existe o el cuerpo de la solicitud está vacío.`
      });
    }
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar la tarea con id=${id}.`
    });
  }
};

// Eliminar una tarea
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Task.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Tarea eliminada exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo eliminar la tarea con id=${id}. Tal vez la tarea no existe.`
      });
    }
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar la tarea con id=${id}.`
    });
  }
};