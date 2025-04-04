// server/controllers/servicePersonnel.controller.js
const db = require("../models");
const ServicePersonnel = db.servicePersonnel;
const User = db.users;
const { Op } = require("sequelize");

// Crear y guardar un nuevo técnico
exports.create = async (req, res) => {
  try {
    // Validar la solicitud
    if (!req.body.name) {
      return res.status(400).send({
        message: "El nombre no puede estar vacío."
      });
    }

    if (!req.body.user_id) {
      return res.status(400).send({
        message: "El ID de usuario es requerido."
      });
    }

    // Verificar si el usuario existe
    const user = await User.findByPk(req.body.user_id);
    if (!user) {
      return res.status(404).send({
        message: `Usuario con id=${req.body.user_id} no encontrado.`
      });
    }

    // Crear un técnico
    const technician = {
      user_id: req.body.user_id,
      name: req.body.name,
      specialization: req.body.specialization,
      phone: req.body.phone,
      email: req.body.email,
      is_available: req.body.is_available !== undefined ? req.body.is_available : true
    };

    // Guardar el técnico en la base de datos
    const createdTechnician = await ServicePersonnel.create(technician);
    res.status(201).send(createdTechnician);
  } catch (error) {
    console.error("Error creating technician:", error);
    res.status(500).send({
      message: error.message || "Error al crear el técnico."
    });
  }
};

// Obtener todos los técnicos
exports.findAll = async (req, res) => {
  try {
    const technicians = await ServicePersonnel.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'phone']
        }
      ]
    });
    res.send(technicians);
  } catch (error) {
    console.error("Error fetching technicians:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar los técnicos."
    });
  }
};

// Encontrar técnicos disponibles
exports.findAvailable = async (req, res) => {
  try {
    const technicians = await ServicePersonnel.findAll({
      where: { is_available: true },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'phone']
        }
      ]
    });
    res.send(technicians);
  } catch (error) {
    console.error("Error fetching available technicians:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar los técnicos disponibles."
    });
  }
};

// Encontrar un técnico por ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const technician = await ServicePersonnel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'phone']
        }
      ]
    });

    if (!technician) {
      return res.status(404).send({
        message: `Técnico con id=${id} no encontrado.`
      });
    }

    res.send(technician);
  } catch (error) {
    console.error(`Error fetching technician ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar el técnico con id=${id}.`
    });
  }
};

// Actualizar un técnico
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await ServicePersonnel.update(req.body, {
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Técnico actualizado exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo actualizar el técnico con id=${id}. Tal vez el técnico no existe o el cuerpo de la solicitud está vacío.`
      });
    }
  } catch (error) {
    console.error(`Error updating technician ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar el técnico con id=${id}.`
    });
  }
};

// Eliminar un técnico
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const technician = await ServicePersonnel.findByPk(id);
    if (!technician) {
      return res.status(404).send({
        message: `Técnico con id=${id} no encontrado.`
      });
    }

    // No eliminar el usuario asociado, solo el técnico
    const num = await ServicePersonnel.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Técnico eliminado exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo eliminar el técnico con id=${id}.`
      });
    }
  } catch (error) {
    console.error(`Error deleting technician ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar el técnico con id=${id}.`
    });
  }
};