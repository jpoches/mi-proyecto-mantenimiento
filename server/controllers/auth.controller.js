// server/controllers/auth.controller.js (versión corregida)
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
      role: req.body.role || "client"
    });

    // Si el rol es cliente, crear registro en la tabla de clientes
    if (req.body.role === "client") {
      await Client.create({
        user_id: user.id,
        name: req.body.name || req.body.username,
        address: req.body.address || "",
        contact_person: req.body.contact_person || "",
        phone: req.body.phone || "",
        email: req.body.email
      });
    }

    // Si el rol es técnico, crear registro en la tabla de personal de servicio
    if (req.body.role === "technician") {
      await ServicePersonnel.create({
        user_id: user.id,
        name: req.body.name || req.body.username,
        specialization: req.body.specialization || "",
        phone: req.body.phone || "",
        email: req.body.email,
        is_available: true
      });
    }

    res.status(201).send({ message: "Usuario registrado exitosamente!" });
  } catch (error) {
    console.error("Error en signup:", error);
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
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    // Verificar contraseña
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Contraseña inválida!"
      });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration // 3600 segundos = 1 hora
    });

    // Preparar datos del usuario
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
          contact_person: clientData.contact_person,
          phone: clientData.phone,
          email: clientData.email
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
          is_available: technicianData.is_available,
          phone: technicianData.phone,
          email: technicianData.email
        };
      }
    }

    // Enviar respuesta con token y datos del usuario
    res.status(200).send({
      user: userData,
      accessToken: token
    });
  } catch (error) {
    console.error("Error en signin:", error);
    res.status(500).send({ 
      message: "Error durante el inicio de sesión", 
      error: error.message 
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // Establecido por middleware
    
    // Si no hay userId, significa que no está autenticado
    if (!userId) {
      return res.status(401).send({
        message: "No autenticado"
      });
    }
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).send({
        message: "Usuario no encontrado."
      });
    }

    // Preparar datos del usuario
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
          contact_person: clientData.contact_person,
          phone: clientData.phone,
          email: clientData.email
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
          is_available: technicianData.is_available,
          phone: technicianData.phone,
          email: technicianData.email
        };
      }
    }

    res.send(userData);
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    res.status(500).send({
      message: "Error al recuperar el usuario actual."
    });
  }
};