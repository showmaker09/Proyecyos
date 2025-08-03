
const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// Rutas para la gestión de pagos
router.get('/', pagoController.getAllPagos); // GET /api/pagos
router.get('/:id', pagoController.getPagoById); // GET /api/pagos/:id
router.post('/', pagoController.createPago); // POST /api/pagos
router.put('/:id', pagoController.updatePago); // PUT /api/pagos/:id
router.delete('/:id', pagoController.deletePago); // DELETE /api/pagos/:id

module.exports = router;