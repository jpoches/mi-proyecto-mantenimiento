// server/routes/quote.routes.js
const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote.controller');
const { authJwt } = require('../middleware');

// Rutas para cotizaciones
router.post('/', [authJwt.verifyToken], quoteController.create);
router.get('/', [authJwt.verifyToken], quoteController.findAll);
router.patch('/:id', [authJwt.verifyToken], quoteController.update);
router.delete('/:id', [authJwt.verifyToken], quoteController.delete);

module.exports = router;