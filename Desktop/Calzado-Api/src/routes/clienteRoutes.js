
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rutas para la gestión de clientes
router.get('/', clienteController.getAllClients); // GET /api/clients
router.get('/:id', clienteController.getClientById); // GET /api/clients/:id
router.post('/', clienteController.createClient); // POST /api/clients
router.put('/:id', clienteController.updateClient); // PUT /api/clients/:id
router.delete('/:id', clienteController.deleteClient); // DELETE /api/clients/:id

module.exports = router;