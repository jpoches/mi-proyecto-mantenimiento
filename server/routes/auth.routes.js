// server/routes/auth.routes.js (versión corregida)
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { authJwt } = require('../middleware');
const verifySignUp = require('../middleware/verifySignUp');

// Ruta para registrar nuevo usuario
router.post('/signup', [
  verifySignUp.checkDuplicateUsername,
  verifySignUp.checkDuplicateEmail,
  verifySignUp.checkRoleExists
], controller.signup);

// Ruta para iniciar sesión
router.post('/signin', controller.signin);

// Ruta para obtener el usuario actual (protegida)
router.get('/me', [authJwt.verifyToken], controller.getCurrentUser);

module.exports = router;