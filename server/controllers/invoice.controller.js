// server/controllers/invoice.controller.js
const db = require("../models");
const Invoice = db.invoices;
const WorkOrder = db.workOrders;
const Client = db.clients;
const Request = db.requests;
const Notification = db.notifications;
const { Op } = require("sequelize");

// Crear y guardar una nueva factura
exports.create = async (req, res) => {
  try {
    // Validar la solicitud
    if (!req.body.work_order_id) {
      return res.status(400).send({
        message: "El ID de la orden de trabajo es requerido."
      });
    }

    if (!req.body.client_id) {
      return res.status(400).send({
        message: "El ID del cliente es requerido."
      });
    }

    if (!req.body.amount) {
      return res.status(400).send({
        message: "El monto es requerido."
      });
    }

    // Verificar si la orden existe
    const workOrder = await WorkOrder.findByPk(req.body.work_order_id);
    if (!workOrder) {
      return res.status(404).send({
        message: `Orden de trabajo con id=${req.body.work_order_id} no encontrada.`
      });
    }

    // Verificar si el cliente existe
    const client = await Client.findByPk(req.body.client_id);
    if (!client) {
      return res.status(404).send({
        message: `Cliente con id=${req.body.client_id} no encontrado.`
      });
    }

    // Crear fecha de vencimiento (30 días por defecto)
    const dueDate = req.body.due_date || new Date(new Date().setDate(new Date().getDate() + 30));

    // Crear una factura
    const invoice = {
      work_order_id: req.body.work_order_id,
      client_id: req.body.client_id,
      amount: req.body.amount,
      status: "pending",
      due_date: dueDate
    };

    // Guardar la factura en la base de datos
    const createdInvoice = await Invoice.create(invoice);

    // Crear notificación para el cliente
    await Notification.create({
      user_id: client.user_id,
      title: "Nueva factura",
      message: `Se ha generado una nueva factura por $${req.body.amount} para la orden de trabajo #${req.body.work_order_id}`,
      type: "invoice"
    });

    // Buscar información relacionada para incluir en la respuesta
    const invoiceWithRelations = await Invoice.findByPk(createdInvoice.id, {
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status']
        },
        {
          model: Client,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).send(invoiceWithRelations);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).send({
      message: error.message || "Error al crear la factura."
    });
  }
};

// Obtener todas las facturas
exports.findAll = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status']
        },
        {
          model: Client,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las facturas."
    });
  }
};

// Encontrar facturas pendientes
exports.findPending = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status']
        },
        {
          model: Client,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [["due_date", "ASC"]]
    });
    res.send(invoices);
  } catch (error) {
    console.error("Error fetching pending invoices:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las facturas pendientes."
    });
  }
};

// Encontrar facturas por cliente
exports.findByClient = async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const invoices = await Invoice.findAll({
      where: { client_id: clientId },
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status']
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(invoices);
  } catch (error) {
    console.error(`Error fetching invoices for client ${clientId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las facturas del cliente ${clientId}.`
    });
  }
};

// Encontrar facturas pendientes por cliente
exports.findPendingByClient = async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const invoices = await Invoice.findAll({
      where: { 
        client_id: clientId,
        status: 'pending'
      },
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status']
        }
      ],
      order: [["due_date", "ASC"]]
    });
    res.send(invoices);
  } catch (error) {
    console.error(`Error fetching pending invoices for client ${clientId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las facturas pendientes del cliente ${clientId}.`
    });
  }
};

// Encontrar facturas por orden de trabajo
exports.findByWorkOrder = async (req, res) => {
  const workOrderId = req.params.workOrderId;

  try {
    const invoices = await Invoice.findAll({
      where: { work_order_id: workOrderId },
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(invoices);
  } catch (error) {
    console.error(`Error fetching invoices for work order ${workOrderId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las facturas para la orden ${workOrderId}.`
    });
  }
};

// Encontrar una factura por ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: WorkOrder,
          attributes: ['id', 'title', 'status', 'description']
        },
        {
          model: Client,
          attributes: ['id', 'name', 'email', 'address', 'phone']
        }
      ]
    });

    if (!invoice) {
      return res.status(404).send({
        message: `Factura con id=${id} no encontrada.`
      });
    }

    res.send(invoice);
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar la factura con id=${id}.`
    });
  }
};

// Actualizar el estado de una factura
exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    // Validar estado
    if (!status || !["pending", "paid"].includes(status)) {
      return res.status(400).send({
        message: "Estado inválido."
      });
    }

    // Actualizar datos según el estado
    const updateData = { status };

    if (status === "paid") {
      updateData.payment_date = new Date();
    }

    const [num] = await Invoice.update(updateData, {
      where: { id: id }
    });

    if (num === 1) {
      // Encontrar factura para notificación
      const invoice = await Invoice.findByPk(id, {
        include: [
          {
            model: Client,
            attributes: ['id', 'user_id', 'name']
          }
        ]
      });

      if (invoice && invoice.client) {
        // Notificar al cliente
        await Notification.create({
          user_id: invoice.client.user_id,
          title: "Factura actualizada",
          message: `Su factura #${id} ha sido marcada como ${status === 'paid' ? 'pagada' : 'pendiente'}.`,
          type: "invoice"
        });
      }

      res.send({
        message: "El estado de la factura se actualizó exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo actualizar el estado de la factura con id=${id}. Tal vez la factura no existe.`
      });
    }
  } catch (error) {
    console.error(`Error updating invoice status ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar el estado de la factura con id=${id}.`
    });
  }
};

// Actualizar una factura
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Invoice.update(req.body, {
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Factura actualizada exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo actualizar la factura con id=${id}. Tal vez la factura no existe o el cuerpo de la solicitud está vacío.`
      });
    }
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar la factura con id=${id}.`
    });
  }
};

// Eliminar una factura
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Invoice.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Factura eliminada exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo eliminar la factura con id=${id}. Tal vez la factura no existe.`
      });
    }
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar la factura con id=${id}.`
    });
  }
};