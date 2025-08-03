const express = require('express');
const router = express.Router();
const montoController = require('../controllers/montoController');

// Rutas para la gestión de montos
router.get('/', montoController.getAllMontos); // GET /api/montos
router.get('/:id', montoController.getMontoById); // GET /api/montos/:id
router.post('/', montoController.createMonto); // POST /api/montos
router.put('/:id', montoController.updateMonto); // PUT /api/montos/:id
router.delete('/:id', montoController.deleteMonto); // DELETE /api/montos/:id

module.exports = router;