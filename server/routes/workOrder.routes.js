// server/routes/workOrder.routes.js
module.exports = app => {
    const workOrders = require("../controllers/workOrder.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para órdenes de trabajo
    router.post("/", [authJwt.isAdmin], workOrders.create);
    router.get("/", workOrders.findAll);
    router.get("/recent", workOrders.findRecent);
    router.get("/active", workOrders.findActive);
    router.get("/technician/:technicianId", workOrders.findAllByTechnician);
    router.get("/technician/:technicianId/recent", workOrders.findRecentByTechnician);
    router.get("/technician/:technicianId/active", workOrders.findActiveByTechnician);
    router.get("/:id", workOrders.findOne);
    router.patch("/:id/status", workOrders.updateStatus);
    router.put("/:id", workOrders.update);
    router.delete("/:id", [authJwt.isAdmin], workOrders.delete);
  
    app.use("/api/work-orders", router);
  };