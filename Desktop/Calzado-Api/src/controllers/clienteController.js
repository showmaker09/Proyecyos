const clienteModel = require('../models/clienteModel');

const clienteController = 
{
    getAllClients: (req, res) => {
        clienteModel.getAllClients((err, clients) => 
        {
            if (err) {
                console.error('Error al obtener clientes:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(clients);
        });
    },

    getClientById: (req, res) => 
    {
        const clientId = req.params.id;
        clienteModel.getClientById(clientId, (err, client) => 
        {
            if (err) {
                console.error('Error al obtener cliente por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!client) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            res.status(200).json(client);
        });
    },

    createClient: (req, res) => 
    {
        const clientData = req.body; // Los datos del nuevo cliente vienen en el cuerpo de la petición
        clienteModel.createClient(clientData, (err, newClientId) => {
            if (err) {
                console.error('Error al crear cliente:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Cliente creado exitosamente', id: newClientId });
        });
    },

    updateClient: (req, res) => {
        const clientId = req.params.id;
        const clientData = req.body;
        clienteModel.updateClient(clientId, clientData, (err, affectedRows) => {
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

    deleteClient: (req, res) => {
        const clientId = req.params.id;
        clienteModel.deleteClient(clientId, (err, affectedRows) => {
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