// server/controllers/user.controller.js
const db = require("../models");
const User = db.users;
const Client = db.clients;
const ServicePersonnel = db.servicePersonnel;
const bcrypt = require("bcryptjs");

// Obtener todos los usuarios
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar los usuarios."
    });
  }
};

// Obtener perfil de usuario autenticado
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).send({
        message: "Usuario no encontrado."
      });
    }

    let userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    // Obtener información adicional según el rol
    if (user.role === "client") {
      const clientData = await Client.findOne({
        where: { user_id: user.id }
      });
      
      if (clientData) {
        userData.clientInfo = {
          id: clientData.id,
          name: clientData.name,
          address: clientData.address,
          contact_person: clientData.contact_person
        };
      }
    } else if (user.role === "technician") {
      const technicianData = await ServicePersonnel.findOne({
        where: { user_id: user.id }
      });
      
      if (technicianData) {
        userData.technicianInfo = {
          id: technicianData.id,
          name: technicianData.name,
          specialization: technicianData.specialization,
          is_available: technicianData.is_available
        };
      }
    }

    res.send(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar el perfil."
    });
  }
};

// Encontrar un usuario por ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).send({
        message: `Usuario con id=${id} no encontrado.`
      });
    }

    res.send(user);
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar el usuario con id=${id}.`
    });
  }
};

// Actualizar un usuario
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    // Verificar si el usuario tiene permisos para actualizar este usuario
    if (req.userId != id && req.userRole !== "admin") {
      return res.status(403).send({
        message: "No tiene permisos para actualizar este usuario."
      });
    }

    // Si hay una nueva contraseña, hashearla
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 8);
    }

    const [num] = await User.update(req.body, {
      where: { id: id }
    });

    if (num === 1) {
      // Si hay datos de cliente o técnico, actualizarlos también
      if (req.body.clientData) {
        await Client.update(req.body.clientData, {
          where: { user_id: id }
        });
      }

      if (req.body.technicianData) {
        await ServicePersonnel.update(req.body.technicianData, {
          where: { user_id: id }
        });
      }

      res.send({
        message: "Usuario actualizado exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo actualizar el usuario con id=${id}. Tal vez el usuario no existe o el cuerpo de la solicitud está vacío.`
      });
    }
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al actualizar el usuario con id=${id}.`
    });
  }
};

// Eliminar un usuario
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await User.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Usuario eliminado exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo eliminar el usuario con id=${id}. Tal vez el usuario no existe.`
      });
    }
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar el usuario con id=${id}.`
    });
  }
};