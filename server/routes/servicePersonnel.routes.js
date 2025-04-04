// server/routes/servicePersonnel.routes.js
module.exports = app => {
    const servicePersonnel = require("../controllers/servicePersonnel.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para personal de servicio
    router.get("/", [authJwt.isAdmin], servicePersonnel.findAll);
    router.post("/", [authJwt.isAdmin], servicePersonnel.create);
    router.get("/available", [authJwt.isAdmin], servicePersonnel.findAvailable);
    router.get("/:id", servicePersonnel.findOne);
    router.put("/:id", servicePersonnel.update);
    router.delete("/:id", [authJwt.isAdmin], servicePersonnel.delete);
  
    app.use("/api/service-personnel", router);
  };