// server/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rutas de autenticación
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;