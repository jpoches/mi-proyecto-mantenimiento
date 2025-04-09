// server/routes/user.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/user.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Obtener perfil de usuario autenticado
router.get("/me", controller.getUserProfile);

// Rutas de administrador
router.get("/", authJwt.isAdmin, controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", authJwt.isAdmin, controller.delete);

module.exports = router;