// server/routes/task.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/task.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para tareas
router.post("/", authJwt.isAdmin, controller.create);
router.get("/", controller.findAll);
router.get("/work-order/:workOrderId", controller.findByWorkOrder);
router.get("/technician/:technicianId", controller.findByTechnician);
router.get("/:id", controller.findOne);
router.patch("/:id/status", controller.updateStatus);
router.put("/:id", controller.update);
router.delete("/:id", authJwt.isAdmin, controller.delete);

module.exports = router;