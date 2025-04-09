// server/routes/quote.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/quote.controller');
const { authJwt } = require('../middleware');

// Middleware para verificar token
router.use(authJwt.verifyToken);

// Rutas para cotizaciones
router.post('/', controller.create);
router.get('/', controller.findAll);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;