// server/routes/workOrder.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/workOrder.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para órdenes de trabajo
router.post("/", authJwt.isAdmin, controller.create);
router.get("/", controller.findAll);
router.get("/recent", controller.findRecent);
router.get("/active", controller.findActive);
router.get("/technician/:technicianId", controller.findAllByTechnician);
router.get("/technician/:technicianId/recent", controller.findRecentByTechnician);
router.get("/technician/:technicianId/active", controller.findActiveByTechnician);
router.get("/:id", controller.findOne);
router.patch("/:id/status", controller.updateStatus);
router.put("/:id", controller.update);
router.delete("/:id", authJwt.isAdmin, controller.delete);

module.exports = router;