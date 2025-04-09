// server/routes/invoice.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/invoice.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para facturas
router.post("/", authJwt.isAdmin, controller.create);
router.get("/", authJwt.isAdmin, controller.findAll);
router.get("/pending", authJwt.isAdmin, controller.findPending);
router.get("/client/:clientId", controller.findByClient);
router.get("/client/:clientId/pending", controller.findPendingByClient);
router.get("/work-order/:workOrderId", controller.findByWorkOrder);
router.get("/:id", controller.findOne);
router.patch("/:id/status", controller.updateStatus);
router.put("/:id", authJwt.isAdmin, controller.update);
router.delete("/:id", authJwt.isAdmin, controller.delete);

module.exports = router;