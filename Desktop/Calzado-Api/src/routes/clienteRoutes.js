
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rutas para la gestión de clientes
router.get('/', clienteController.getAllClientes); // GET /api/clients
router.get('/:id', clienteController.getClienteById); // GET /api/clients/:id
router.post('/', clienteController.createCliente); // POST /api/clients
router.put('/:id', clienteController.updateCliente); // PUT /api/clients/:id
router.delete('/:id', clienteController.deleteCliente); // DELETE /api/clients/:id

module.exports = router;