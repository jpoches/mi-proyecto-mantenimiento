// server/middleware/authJwt.js
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

const verifyToken = (req, res, next) => {
  // Obtener el token de los headers
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  // Verificar si el token existe
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  // Si el token viene con el prefijo "Bearer ", eliminarlo
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  // Verificar y decodificar el token
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({
          message: "Token expired"
        });
      }
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    
    // Si el token es válido, guardar el ID del usuario en la request
    req.userId = decoded.id;
    
    // Obtener información del usuario (opcional)
    User.findByPk(decoded.id)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: "User not found."
          });
        }
        
        // Guardar rol del usuario para validaciones posteriores
        req.userRole = user.role;
        next();
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving user."
        });
      });
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    next();
    return;
  }
  
  res.status(403).send({
    message: "Require Admin Role!"
  });
};

const isTechnician = (req, res, next) => {
  if (req.userRole === "technician" || req.userRole === "admin") {
    next();
    return;
  }
  
  res.status(403).send({
    message: "Require Technician Role!"
  });
};

const isClient = (req, res, next) => {
  if (req.userRole === "client" || req.userRole === "admin") {
    next();
    return;
  }
  
  res.status(403).send({
    message: "Require Client Role!"
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isTechnician,
  isClient
};

module.exports = authJwt;