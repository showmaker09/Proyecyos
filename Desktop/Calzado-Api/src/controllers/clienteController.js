const clienteModel = require('../models/clienteModel');

const clienteController = 
{
    getAllClientes: (req, res) => {
        clienteModel.getAllClientes((err, clientes) => {
            if (err) {
                console.error('Error al obtener clientes:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(clientes);
        });
    },

    getClienteById: (req, res) => 
    {
        const clientId = req.params.id;
        clienteModel.getClienteById(clientId, (err, cliente) => {
            if (err) {
                console.error('Error al obtener cliente por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            res.status(200).json(cliente);
        });
    },

    createCliente: (req, res) => 
    {
        const clientData = req.body; // Los datos del nuevo cliente vienen en el cuerpo de la petición
        clienteModel.createCliente(clientData, (err, newClientId) => {
            if (err) {
                console.error('Error al crear cliente:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Cliente creado exitosamente', id: newClientId });
        });
    },

    updateCliente: (req, res) => {
        const clientId = req.params.id;
        const clientData = req.body;
        clienteModel.updateCliente(clientId, clientData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar cliente:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Cliente no encontrado o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Cliente actualizado exitosamente' });
        });
    },

    deleteCliente: (req, res) => {
        const clientId = req.params.id;
        clienteModel.deleteCliente(clientId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar cliente:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            res.status(200).json({ message: 'Cliente eliminado exitosamente' });
        });
    }
};

module.exports = clienteController;