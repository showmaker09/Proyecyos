const reparacionModel = require('../models/reparacionModel');

const reparacionController = {
    getAllReparaciones: (req, res) => {
        reparacionModel.getAllReparaciones((err, reparaciones) => {
            if (err) {
                console.error('Error al obtener reparaciones:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(reparaciones);
        });
    },

    getReparacionById: (req, res) => {
        const reparacionId = req.params.id;
        reparacionModel.getReparacionById(reparacionId, (err, reparacion) => {
            if (err) {
                console.error('Error al obtener reparacion por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!reparacion) {
                return res.status(404).json({ message: 'Reparacion no encontrada' });
            }
            res.status(200).json(reparacion);
        });
    },

    createReparacion: (req, res) => {
        const reparacionData = req.body; // Los datos de la nueva reparacion vienen en el cuerpo de la petición
        reparacionModel.createReparacion(reparacionData, (err, newReparacionId) => {
            if (err) {
                console.error('Error al crear reparacion:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Reparacion creada exitosamente', id: newReparacionId });
        });
    },

    updateReparacion: (req, res) => {
        const reparacionId = req.params.id;
        const reparacionData = req.body;
        reparacionModel.updateReparacion(reparacionId, reparacionData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar reparacion:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Reparacion no encontrada o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Reparacion actualizada exitosamente' });
        });
    },

    deleteReparacion: (req, res) => {
        const reparacionId = req.params.id;
        reparacionModel.deleteReparacion(reparacionId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar reparacion:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Reparacion no encontrada' });
            }
            res.status(200).json({ message: 'Reparacion eliminada exitosamente' });
        });
    }
};

module.exports = reparacionController;