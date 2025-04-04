// server/controllers/auth.controller.js
const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Client = db.clients;
const ServicePersonnel = db.servicePersonnel;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    // Guardar usuario en la base de datos
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      phone: req.body.phone,
      role: req.body.role
    });

    // Si el rol es cliente, crear registro en la tabla de clientes
    if (req.body.role === "client") {
      await Client.create({
        user_id: user.id,
        name: req.body.name || req.body.username,
        address: req.body.address,
        contact_person: req.body.contact_person,
        phone: req.body.phone,
        email: req.body.email
      });
    }

    // Si el rol es técnico, crear registro en la tabla de personal de servicio
    if (req.body.role === "technician") {
      await ServicePersonnel.create({
        user_id: user.id,
        name: req.body.name || req.body.username,
        specialization: req.body.specialization,
        phone: req.body.phone,
        email: req.body.email,
        is_available: true
      });
    }

    res.send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    // Buscar usuario por nombre de usuario
    const user = await User.findOne({
      where: { username: req.body.username }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    // Verificar contraseña
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    // Preparar datos del usuario
    let userData = {
      id: user.id,
      username: user.username,
      email: user.email,
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

    // Enviar respuesta con token y datos del usuario
    res.status(200).send({
      user: userData,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};