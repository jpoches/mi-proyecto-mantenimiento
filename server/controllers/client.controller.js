// server/controllers/client.controller.js
const db = require("../models");
const Client = db.clients;
const User = db.users;
const { Op } = require("sequelize");

// Crear y guardar un nuevo cliente
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

    // Crear un cliente
    const client = {
      user_id: req.body.user_id,
      name: req.body.name,
      address: req.body.address,
      contact_person: req.body.contact_person,
      phone: req.body.phone,
      email: req.body.email
    };

    // Guardar el cliente en la base de datos
    const createdClient = await Client.create(client);
    res.status(201).send(createdClient);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).send({
      message: error.message || "Error al crear el cliente."
    });
  }
};

// Obtener todos los clientes
exports.findAll = async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'phone']
        }
      ]
    });
    res.send(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar los clientes."
    });
  }
};

// Encontrar un cliente por ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const client = await Client.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'phone']
        }
      ]
    });

    if (!client) {
      return res.status(404).send({
        message: `Cliente con id=${id} no encontrado.`
      });
    }

    res.send(client);
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar el cliente con id=${id}.`
    });
  }
};

// Actualizar un cliente
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Client.update(req.body, {
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Cliente actualizado exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo actualizar el cliente con id=${id}. Tal vez el cliente no existe o el cuerpo de la solicitud está vacío.`
      });
    }
  } catch (error) {
    console.error(`Error updating client ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar el cliente con id=${id}.`
    });
  }
};

// Eliminar un cliente
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).send({
        message: `Cliente con id=${id} no encontrado.`
      });
    }

    // No eliminar el usuario asociado, solo el cliente
    const num = await Client.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Cliente eliminado exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo eliminar el cliente con id=${id}.`
      });
    }
  } catch (error) {
    console.error(`Error deleting client ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar el cliente con id=${id}.`
    });
  }
};