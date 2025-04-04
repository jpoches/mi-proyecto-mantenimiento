// server/routes/task.routes.js
module.exports = app => {
    const tasks = require("../controllers/task.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Rutas para tareas
    router.post("/", [authJwt.isAdmin], tasks.create);
    router.get("/", tasks.findAll);
    router.get("/work-order/:workOrderId", tasks.findByWorkOrder);
    router.get("/technician/:technicianId", tasks.findByTechnician);
    router.get("/:id", tasks.findOne);
    router.patch("/:id/status", tasks.updateStatus);
    router.put("/:id", tasks.update);
    router.delete("/:id", [authJwt.isAdmin], tasks.delete);
  
    app.use("/api/tasks", router);
  };