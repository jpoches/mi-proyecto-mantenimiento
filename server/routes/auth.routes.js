// server/routes/auth.routes.js
module.exports = app => {
    const auth = require("../controllers/auth.controller");
    const router = require("express").Router();
  
    // Rutas de autenticación
    router.post("/signup", auth.signup);
    router.post("/signin", auth.signin);
  
    app.use("/api/auth", router);
  };