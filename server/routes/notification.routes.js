// server/routes/notification.routes.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/notification.controller");
const { authJwt } = require("../middleware");

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para notificaciones
router.get("/", controller.findAll);
router.get("/user/:userId", controller.findByUser);
router.get("/unread", controller.findUnread);
router.patch("/:id/read", controller.markAsRead);
router.patch("/read-all", controller.markAllAsRead);
router.delete("/:id", controller.delete);

module.exports = router;