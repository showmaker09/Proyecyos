
const express = require('express');
const router = express.Router();
const tipoController = require('../controllers/tipoController');

// Rutas para la gestión de tipos
router.get('/', tipoController.getAllTipos); // GET /api/tipos
router.get('/:id', tipoController.getTipoById); // GET /api/tipos/:id
router.post('/', tipoController.createTipo); // POST /api/tipos
router.put('/:id', tipoController.updateTipo); // PUT /api/tipos/:id
router.delete('/:id', tipoController.deleteTipo); // DELETE /api/tipos/:id

module.exports = router;