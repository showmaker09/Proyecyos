const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articuloController'); // Importa el controlador de Dueño

// Rutas para la gestión de articulos
router.get('/', articuloController.getAllArticulos); // GET /api/articulos
router.get('/:id', articuloController.getArticuloById); // GET /api/articulos/:id
router.post('/', articuloController.createArticulo); // POST /api/articulos
router.put('/:id', articuloController.updateArticulo); // PUT /api/articulos/:id
router.delete('/:id', articuloController.deleteArticulo); // DELETE /api/articulos/:id

module.exports = router;