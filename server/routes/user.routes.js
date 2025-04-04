// server/routes/user.routes.js
module.exports = app => {
    const users = require("../controllers/user.controller");
    const { authJwt } = require("../middleware");
    const router = require("express").Router();
  
    // Aplicar middleware para proteger rutas
    router.use(authJwt.verifyToken);
  
    // Obtener perfil del usuario autenticado
    router.get("/me", users.getUserProfile);
    
    // Rutas de administrador
    router.get("/", [authJwt.isAdmin], users.findAll);
    router.get("/:id", users.findOne);
    router.put("/:id", users.update);
    router.delete("/:id", [authJwt.isAdmin], users.delete);
  
    app.use("/api/users", router);
  };