const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// Rutas para la gestión de materiales
router.get('/', materialController.getAllMateriales); // GET /api/materiales
router.get('/:id', materialController.getMaterialById); // GET /api/materiales/:id
router.post('/', materialController.createMaterial); // POST /api/materiales
router.put('/:id', materialController.updateMaterial); // PUT /api/materiales/:id
router.delete('/:id', materialController.deleteMaterial); // DELETE /api/materiales/:id

module.exports = router;