// server/routes/request.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/request.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para solicitudes
router.post("/", controller.create);
router.get("/", authJwt.isAdmin, controller.findAll);
router.get("/recent", authJwt.isAdmin, controller.findRecent);
router.get("/approved", authJwt.isAdmin, controller.findApproved);
router.get("/client/:clientId", controller.findAllByClient);
router.get("/client/:clientId/recent", controller.findRecentByClient);
router.get("/:id", controller.findOne);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;