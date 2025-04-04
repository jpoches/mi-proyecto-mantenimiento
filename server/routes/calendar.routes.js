// server/routes/calendar.routes.js
module.exports = app => {
    const calendar = require("../controllers/calendar.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para eventos de calendario
    router.post("/", [authJwt.isAdmin], calendar.create);
    router.get("/", calendar.findAll);
    router.get("/upcoming", calendar.findUpcoming);
    router.get("/client/:clientId/upcoming", calendar.findUpcomingByClient);
    router.get("/technician/:technicianId/upcoming", calendar.findUpcomingByTechnician);
    router.get("/:id", calendar.findOne);
    router.put("/:id", [authJwt.isAdmin], calendar.update);
    router.delete("/:id", [authJwt.isAdmin], calendar.delete);
  
    app.use("/api/calendar", router);
  };