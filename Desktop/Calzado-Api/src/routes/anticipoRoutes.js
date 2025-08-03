const express = require('express');
const router = express.Router();
const anticipoController = require('../controllers/anticipoController');

// Rutas para la gestión de anticipos
router.get('/', anticipoController.getAllAnticipos); // GET /api/anticipos
router.get('/:id', anticipoController.getAnticipoById); // GET /api/anticipos/:id
router.post('/', anticipoController.createAnticipo); // POST /api/anticipos
router.put('/:id', anticipoController.updateAnticipo); // PUT /api/anticipos/:id
router.delete('/:id', anticipoController.deleteAnticipo); // DELETE /api/anticipos/:id

module.exports = router;