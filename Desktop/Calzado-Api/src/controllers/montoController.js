const userModel = require('../models/montoModel');

const montoController = {
    getAllMontos: (req, res) => {
        montoModel.getAllMontos((err, montos) => {
            if (err) {
                console.error('Error al obtener montos:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(montos);
        });
    },

    getMontoById: (req, res) => {
        const montoId = req.params.id;
        montoModel.getMontoById(montoId, (err, monto) => {
            if (err) {
                console.error('Error al obtener monto por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!monto) {
                return res.status(404).json({ message: 'Monto no encontrado' });
            }
            res.status(200).json(monto);
        });
    },

    createMonto: (req, res) => {
        const montoData = req.body; // Los datos del nuevo monto vienen en el cuerpo de la petición
        montoModel.createMonto(montoData, (err, newMontoId) => {
            if (err) {
                console.error('Error al crear monto:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Monto creado exitosamente', id: newMontoId });
        });
    },

    updateMonto: (req, res) => {
        const montoId = req.params.id;
        const montoData = req.body;
        montoModel.updateMonto(montoId, montoData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar monto:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Monto no encontrado o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Monto actualizado exitosamente' });
        });
    },

    deleteMonto: (req, res) => {
        const montoId = req.params.id;
        montoModel.deleteMonto(montoId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar monto:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Monto no encontrado' });
            }
            res.status(200).json({ message: 'Monto eliminado exitosamente' });
        });
    }
};

module.exports = montoController;