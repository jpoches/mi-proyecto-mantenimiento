// server/routes/attachment.routes.js
module.exports = app => {
    const attachments = require("../controllers/attachment.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para archivos adjuntos
    router.get("/request/:requestId", attachments.findByRequest);
    router.get("/:id", attachments.findOne);
    router.get("/:id/download", attachments.download);
    router.delete("/:id", attachments.delete);
  
    app.use("/api/attachments", router);
  };