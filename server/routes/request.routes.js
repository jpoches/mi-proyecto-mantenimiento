// server/routes/request.routes.js
module.exports = app => {
    const requests = require("../controllers/request.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para solicitudes
    router.post("/", requests.create);
    router.get("/", [authJwt.isAdmin], requests.findAll);
    router.get("/recent", [authJwt.isAdmin], requests.findRecent);
    router.get("/approved", [authJwt.isAdmin], requests.findApproved);
    router.get("/client/:clientId", requests.findAllByClient);
    router.get("/client/:clientId/recent", requests.findRecentByClient);
    router.get("/:id", requests.findOne);
    router.patch("/:id", requests.update);
    router.delete("/:id", requests.delete);
  
    app.use("/api/requests", router);
  };