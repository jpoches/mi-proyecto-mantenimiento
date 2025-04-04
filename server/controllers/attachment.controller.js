// server/controllers/attachment.controller.js
const db = require("../models");
const Attachment = db.attachments;
const Request = db.requests;
const fs = require("fs");
const path = require("path");

// Encontrar archivos adjuntos por solicitud
exports.findByRequest = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const attachments = await Attachment.findAll({
      where: { request_id: requestId },
      order: [["created_at", "DESC"]]
    });
    res.send(attachments);
  } catch (error) {
    console.error(`Error fetching attachments for request ${requestId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar los archivos adjuntos para la solicitud ${requestId}.`
    });
  }
};

// Encontrar un archivo adjunto por ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const attachment = await Attachment.findByPk(id, {
      include: [
        {
          model: Request,
          attributes: ['id', 'title']
        }
      ]
    });

    if (!attachment) {
      return res.status(404).send({
        message: `Archivo adjunto con id=${id} no encontrado.`
      });
    }

    res.send(attachment);
  } catch (error) {
    console.error(`Error fetching attachment ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar el archivo adjunto con id=${id}.`
    });
  }
};

// Descargar un archivo adjunto
exports.download = async (req, res) => {
  const id = req.params.id;

  try {
    const attachment = await Attachment.findByPk(id);

    if (!attachment) {
      return res.status(404).send({
        message: `Archivo adjunto con id=${id} no encontrado.`
      });
    }

    // Verificar si el archivo existe en el sistema de archivos
    if (!fs.existsSync(attachment.file_path)) {
      return res.status(404).send({
        message: "El archivo físico no se encuentra en el servidor."
      });
    }

    // Enviar el archivo
    res.download(attachment.file_path, attachment.file_name);
  } catch (error) {
    console.error(`Error downloading attachment ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al descargar el archivo adjunto con id=${id}.`
    });
  }
};

// Eliminar un archivo adjunto
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const attachment = await Attachment.findByPk(id);
    
    if (!attachment) {
      return res.status(404).send({
        message: `Archivo adjunto con id=${id} no encontrado.`
      });
    }

    // Eliminar el archivo físico si existe
    if (fs.existsSync(attachment.file_path)) {
      fs.unlinkSync(attachment.file_path);
    }

    // Eliminar el registro de la base de datos
    const num = await Attachment.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Archivo adjunto eliminado exitosamente."
      });
    } else {
      res.status(500).send({
        message: `No se pudo eliminar el archivo adjunto con id=${id}.`
      });
    }
  } catch (error) {
    console.error(`Error deleting attachment ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar el archivo adjunto con id=${id}.`
    });
  }
};