// server/routes/servicePersonnel.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/servicePersonnel.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para personal de servicio
router.get("/", authJwt.isAdmin, controller.findAll);
router.post("/", authJwt.isAdmin, controller.create);
router.get("/available", authJwt.isAdmin, controller.findAvailable);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", authJwt.isAdmin, controller.delete);

module.exports = router;