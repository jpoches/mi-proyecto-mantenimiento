// server/controllers/request.controller.js
const db = require("../models");
const Request = db.requests;
const Client = db.clients;
const User = db.users;
const Attachment = db.attachments;
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const multer = require("multer");

// Configuración para almacenamiento de archivos adjuntos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/attachments";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
}).array("attachments", 5); // Máximo 5 archivos

// Crear y guardar una nueva solicitud
exports.create = (req, res) => {
  // Manejo de archivos adjuntos
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Error al subir archivos adjuntos."
      });
    }

    try {
      // Validar la solicitud
      if (!req.body.title) {
        return res.status(400).send({
          message: "El título no puede estar vacío."
        });
      }

      if (!req.body.description) {
        return res.status(400).send({
          message: "La descripción no puede estar vacía."
        });
      }

      if (!req.body.client_id) {
        return res.status(400).send({
          message: "El ID del cliente es requerido."
        });
      }

      // Crear una solicitud
      const request = {
        client_id: req.body.client_id,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        service_type: req.body.service_type,
        priority: req.body.priority || "medium",
        status: "pending"
      };

      // Guardar la solicitud en la base de datos
      const createdRequest = await Request.create(request);

      // Guardar archivos adjuntos si existen
      if (req.files && req.files.length > 0) {
        const attachments = req.files.map(file => ({
          request_id: createdRequest.id,
          file_name: file.originalname,
          file_path: file.path,
          file_type: file.mimetype
        }));

        await Attachment.bulkCreate(attachments);
      }

      // Buscar cliente y usuario para incluir en la respuesta
      const client = await Client.findByPk(req.body.client_id);
      
      // Combinar la solicitud con información del cliente
      const responseData = {
        ...createdRequest.toJSON(),
        client: {
          id: client.id,
          name: client.name
        }
      };

      res.status(201).send(responseData);
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).send({
        message: error.message || "Error al crear la solicitud."
      });
    }
  });
};

// Obtener todas las solicitudes
exports.findAll = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email", "phone"]
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las solicitudes."
    });
  }
};

// Obtener solicitudes recientes
exports.findRecent = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email", "phone"]
        }
      ],
      order: [["created_at", "DESC"]],
      limit: 5
    });
    res.send(requests);
  } catch (error) {
    console.error("Error fetching recent requests:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las solicitudes recientes."
    });
  }
};

// Encontrar solicitudes aprobadas que no tienen órdenes de trabajo
exports.findApproved = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email", "phone"]
        }
      ],
      where: {
        status: "approved"
      },
      order: [["created_at", "DESC"]]
    });
    res.send(requests);
  } catch (error) {
    console.error("Error fetching approved requests:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las solicitudes aprobadas."
    });
  }
};

// Encontrar todas las solicitudes de un cliente
exports.findAllByClient = async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const requests = await Request.findAll({
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email", "phone"],
          where: { id: clientId }
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(requests);
  } catch (error) {
    console.error(`Error fetching requests for client ${clientId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las solicitudes del cliente ${clientId}.`
    });
  }
};

// Encontrar solicitudes recientes de un cliente
exports.findRecentByClient = async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const requests = await Request.findAll({
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email", "phone"],
          where: { id: clientId }
        }
      ],
      order: [["created_at", "DESC"]],
      limit: 5
    });
    res.send(requests);
  } catch (error) {
    console.error(`Error fetching recent requests for client ${clientId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las solicitudes recientes del cliente ${clientId}.`
    });
  }
};

// Encontrar una solicitud por ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const request = await Request.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email", "phone"]
        },
        {
          model: Attachment,
          attributes: ["id", "file_name", "file_type", "created_at"]
        }
      ]
    });

    if (!request) {
      return res.status(404).send({
        message: `Solicitud con id=${id} no encontrada.`
      });
    }

    res.send(request);
  } catch (error) {
    console.error(`Error fetching request ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar la solicitud con id=${id}.`
    });
  }
};

// Actualizar una solicitud
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Request.update(req.body, {
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "La solicitud se actualizó exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo actualizar la solicitud con id=${id}. Tal vez la solicitud no existe o el cuerpo de la solicitud está vacío.`
      });
    }
  } catch (error) {
    console.error(`Error updating request ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar la solicitud con id=${id}.`
    });
  }
};

// Eliminar una solicitud
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    // Obtener información sobre los archivos adjuntos
    const attachments = await Attachment.findAll({
      where: { request_id: id }
    });

    // Eliminar la solicitud (las restricciones de clave externa se encargarán de los adjuntos)
    const num = await Request.destroy({
      where: { id: id }
    });

    if (num === 1) {
      // Eliminar archivos físicos
      for (const attachment of attachments) {
        try {
          fs.unlinkSync(attachment.file_path);
        } catch (err) {
          console.error(`Error deleting file ${attachment.file_path}:`, err);
        }
      }

      res.send({
        message: "La solicitud se eliminó exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo eliminar la solicitud con id=${id}. Tal vez la solicitud no existe.`
      });
    }
  } catch (error) {
    console.error(`Error deleting request ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar la solicitud con id=${id}.`
    });
  }
};