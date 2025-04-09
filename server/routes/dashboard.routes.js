// server/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/dashboard.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para el dashboard
router.get("/admin-stats", authJwt.isAdmin, controller.getAdminStats);
router.get("/user-stats/:userId", controller.getUserStats);

module.exports = router;