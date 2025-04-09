// server/routes/calendar.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/calendar.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para eventos de calendario
router.post("/", authJwt.isAdmin, controller.create);
router.get("/", controller.findAll);
router.get("/upcoming", controller.findUpcoming);
router.get("/client/:clientId/upcoming", controller.findUpcomingByClient);
router.get("/technician/:technicianId/upcoming", controller.findUpcomingByTechnician);
router.get("/:id", controller.findOne);
router.put("/:id", authJwt.isAdmin, controller.update);
router.delete("/:id", authJwt.isAdmin, controller.delete);

module.exports = router;