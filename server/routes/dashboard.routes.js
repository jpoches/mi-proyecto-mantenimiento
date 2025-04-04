// server/routes/dashboard.routes.js
module.exports = app => {
    const dashboard = require("../controllers/dashboard.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para el dashboard
    router.get("/admin-stats", [authJwt.isAdmin], dashboard.getAdminStats);
    router.get("/user-stats/:userId", dashboard.getUserStats);
  
    app.use("/api/dashboard", router);
  };