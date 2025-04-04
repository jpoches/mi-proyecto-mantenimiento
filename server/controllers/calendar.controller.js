// server/controllers/calendar.controller.js
const db = require("../models");
const CalendarEvent = db.calendarEvents;
const WorkOrder = db.workOrders;
const ServicePersonnel = db.servicePersonnel;
const Request = db.requests;
const Client = db.clients;
const { Op } = require("sequelize");

// Crear y guardar un nuevo evento
exports.create = async (req, res) => {
  try {
    // Validar la solicitud
    if (!req.body.title) {
      return res.status(400).send({
        message: "El título no puede estar vacío."
      });
    }

    if (!req.body.event_date) {
      return res.status(400).send({
        message: "La fecha del evento es requerida."
      });
    }

    // Si no hay fecha de finalización, establecer 1 hora después del inicio
    const endDate = req.body.end_date || 
      new Date(new Date(req.body.event_date).getTime() + 3600000);

    // Crear un evento
    const event = {
      work_order_id: req.body.work_order_id,
      title: req.body.title,
      description: req.body.description,
      event_date: req.body.event_date,
      end_date: endDate
    };

    // Guardar el evento en la base de datos
    const createdEvent = await CalendarEvent.create(event);

    // Si está relacionado con una orden de trabajo, incluir esa información
    if (req.body.work_order_id) {
      const eventWithRelations = await CalendarEvent.findByPk(createdEvent.id, {
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
        ]
      });
      
      return res.status(201).send(eventWithRelations);
    }

    res.status(201).send(createdEvent);
  } catch (error) {
    console.error("Error creating calendar event:", error);
    res.status(500).send({
      message: error.message || "Error al crear el evento de calendario."
    });
  }
};

// Obtener todos los eventos
exports.findAll = async (req, res) => {
  try {
    const events = await CalendarEvent.findAll({
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
      order: [["event_date", "ASC"]]
    });
    res.send(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar los eventos del calendario."
    });
  }
};

// Encontrar próximos eventos
exports.findUpcoming = async (req, res) => {
  try {
    const now = new Date();
    
    const events = await CalendarEvent.findAll({
      where: {
        event_date: {
          [Op.gte]: now
        }
      },
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
      order: [["event_date", "ASC"]],
      limit: 5
    });
    res.send(events);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar los próximos eventos."
    });
  }
};

// Encontrar próximos eventos para un cliente
exports.findUpcomingByClient = async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const now = new Date();
    
    const events = await CalendarEvent.findAll({
      where: {
        event_date: {
          [Op.gte]: now
        }
      },
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status'],
          include: [
            {
              model: Request,
              where: { client_id: clientId }
            }
          ]
        }
      ],
      order: [["event_date", "ASC"]],
      limit: 5
    });
    res.send(events);
  } catch (error) {
    console.error(`Error fetching upcoming events for client ${clientId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar los próximos eventos para el cliente ${clientId}.`
    });
  }
};

// Encontrar próximos eventos para un técnico
exports.findUpcomingByTechnician = async (req, res) => {
  const technicianId = req.params.technicianId;

  try {
    const now = new Date();
    
    const events = await CalendarEvent.findAll({
      where: {
        event_date: {
          [Op.gte]: now
        }
      },
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status'],
          where: { assigned_to: technicianId }
        }
      ],
      order: [["event_date", "ASC"]],
      limit: 5
    });
    res.send(events);
  } catch (error) {
    console.error(`Error fetching upcoming events for technician ${technicianId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar los próximos eventos para el técnico ${technicianId}.`
    });
  }
};

// Encontrar un evento por ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const event = await CalendarEvent.findByPk(id, {
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status', 'description'],
          include: [
            {
              model: ServicePersonnel,
              attributes: ['id', 'name', 'phone', 'email']
            },
            {
              model: Request,
              include: [
                {
                  model: Client,
                  attributes: ['id', 'name', 'phone', 'email']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!event) {
      return res.status(404).send({
        message: `Evento con id=${id} no encontrado.`
      });
    }

    res.send(event);
  } catch (error) {
    console.error(`Error fetching calendar event ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar el evento con id=${id}.`
    });
  }
};

// Actualizar un evento
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await CalendarEvent.update(req.body, {
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Evento actualizado exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo actualizar el evento con id=${id}. Tal vez el evento no existe o el cuerpo de la solicitud está vacío.`
      });
    }
  } catch (error) {
    console.error(`Error updating calendar event ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar el evento con id=${id}.`
    });
  }
};

// Eliminar un evento
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await CalendarEvent.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Evento eliminado exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo eliminar el evento con id=${id}. Tal vez el evento no existe.`
      });
    }
  } catch (error) {
    console.error(`Error deleting calendar event ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar el evento con id=${id}.`
    });
  }
};