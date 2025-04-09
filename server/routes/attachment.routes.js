// server/routes/attachment.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/attachment.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para archivos adjuntos
router.get("/request/:requestId", controller.findByRequest);
router.get("/:id", controller.findOne);
router.get("/:id/download", controller.download);
router.delete("/:id", controller.delete);

module.exports = router;