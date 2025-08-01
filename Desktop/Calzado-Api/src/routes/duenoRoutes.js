// routes/duenoRoutes.js
const express = require('express');
const router = express.Router();
const duenoController = require('../controllers/duenoController'); // Importa el controlador de Dueño

// Rutas para la gestión de dueños
router.get('/', duenoController.getAllDuenos); // GET /api/duenos
router.get('/:id', duenoController.getDuenoById); // GET /api/duenos/:id
router.post('/', duenoController.addDueno); // POST /api/duenos
router.put('/:id', duenoController.updateDueno); // PUT /api/duenos/:id
router.delete('/:id', duenoController.deleteDueno); // DELETE /api/duenos/:id

module.exports = router;