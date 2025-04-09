// server/middleware/verifySignUp.js
const db = require("../models");
const User = db.users;

// Verificar si el nombre de usuario ya existe
const checkDuplicateUsername = async (req, res, next) => {
  try {
    // Verificar username
    const userByUsername = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (userByUsername) {
      return res.status(400).send({
        message: "El nombre de usuario ya está en uso"
      });
    }

    next();
  } catch (error) {
    console.error("Error checking duplicate username:", error);
    res.status(500).send({
      message: "Error al verificar el nombre de usuario"
    });
  }
};

// Verificar si el email ya existe
const checkDuplicateEmail = async (req, res, next) => {
  try {
    // Verificar email
    const userByEmail = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (userByEmail) {
      return res.status(400).send({
        message: "El email ya está registrado"
      });
    }

    next();
  } catch (error) {
    console.error("Error checking duplicate email:", error);
    res.status(500).send({
      message: "Error al verificar el email"
    });
  }
};

// Verificar si el rol es válido
const checkRoleExists = (req, res, next) => {
  if (req.body.role) {
    if (!["admin", "client", "technician"].includes(req.body.role)) {
      return res.status(400).send({
        message: "El rol no existe = " + req.body.role
      });
    }
  }
  
  next();
};

const verifySignUp = {
  checkDuplicateUsername,
  checkDuplicateEmail,
  checkRoleExists
};

module.exports = verifySignUp;