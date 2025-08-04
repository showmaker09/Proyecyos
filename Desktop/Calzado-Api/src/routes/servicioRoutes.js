
const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

// Rutas para la gestión de servicios
router.get('/', servicioController.getAllServicios); // GET /api/servicios
router.get('/:id', servicioController.getServicioById); // GET /api/servicios/:id
router.post('/', servicioController.createServicio); // POST /api/servicios
router.put('/:id', servicioController.updateServicio); // PUT /api/servicios/:id
router.delete('/:id', servicioController.deleteServicio); // DELETE /api/servicios/:id

module.exports = router;