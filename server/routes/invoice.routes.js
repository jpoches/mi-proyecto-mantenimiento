// server/routes/invoice.routes.js
module.exports = app => {
    const invoices = require("../controllers/invoice.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para facturas
    router.post("/", [authJwt.isAdmin], invoices.create);
    router.get("/", [authJwt.isAdmin], invoices.findAll);
    router.get("/pending", [authJwt.isAdmin], invoices.findPending);
    router.get("/client/:clientId", invoices.findByClient);
    router.get("/client/:clientId/pending", invoices.findPendingByClient);
    router.get("/work-order/:workOrderId", invoices.findByWorkOrder);
    router.get("/:id", invoices.findOne);
    router.patch("/:id/status", invoices.updateStatus);
    router.put("/:id", [authJwt.isAdmin], invoices.update);
    router.delete("/:id", [authJwt.isAdmin], invoices.delete);
  
    app.use("/api/invoices", router);
  };