// server/routes/notification.routes.js
module.exports = app => {
    const notifications = require("../controllers/notification.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para notificaciones
    router.get("/", notifications.findAll);
    router.get("/user/:userId", notifications.findByUser);
    router.get("/unread", notifications.findUnread);
    router.patch("/:id/read", notifications.markAsRead);
    router.patch("/read-all", notifications.markAllAsRead);
    router.delete("/:id", notifications.delete);
  
    app.use("/api/notifications", router);
  };