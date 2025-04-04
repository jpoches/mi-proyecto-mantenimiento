// server/middleware/authJwt.js
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === "admin") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require Admin Role!"
    });
  });
};

isTechnician = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === "technician" || user.role === "admin") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require Technician Role!"
    });
  });
};

isClient = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === "client" || user.role === "admin") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require Client Role!"
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isTechnician,
  isClient
};

module.exports = authJwt;