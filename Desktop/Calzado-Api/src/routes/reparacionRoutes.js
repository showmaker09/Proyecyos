

const express = require('express');
const router = express.Router();
const reparacionController = require('../controllers/reparacionController');

// Rutas para la gestión de reparaciones
router.get('/', reparacionController.getAllReparaciones); // GET /api/reparaciones
router.get('/:id', reparacionController.getReparacionById); // GET /api/reparaciones/:id
router.post('/', reparacionController.createReparacion); // POST /api/reparaciones
router.put('/:id', reparacionController.updateReparacion); // PUT /api/reparaciones/:id
router.delete('/:id', reparacionController.deleteReparacion); // DELETE /api/reparaciones/:id

module.exports = router;