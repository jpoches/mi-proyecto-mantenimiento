// server/routes/client.routes.js
module.exports = app => {
    const clients = require("../controllers/client.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para clientes
    router.get("/", [authJwt.isAdmin], clients.findAll);
    router.post("/", [authJwt.isAdmin], clients.create);
    router.get("/:id", clients.findOne);
    router.put("/:id", clients.update);
    router.delete("/:id", [authJwt.isAdmin], clients.delete);
  
    app.use("/api/clients", router);
  };