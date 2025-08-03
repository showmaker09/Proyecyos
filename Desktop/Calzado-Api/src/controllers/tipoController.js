const tipoModel = require('../models/tipoModel');

const tipoController = {
    getAllTipos: (req, res) => {
        tipoModel.getAllTipos((err, tipos) => {
            if (err) {
                console.error('Error al obtener tipos:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(tipos);
        });
    },

    getTipoById: (req, res) => {
        const tipoId = req.params.id;
        tipoModel.getTipoById(tipoId, (err, tipo) => {
            if (err) {
                console.error('Error al obtener tipo por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!tipo) {
                return res.status(404).json({ message: 'Tipo no encontrado' });
            }
            res.status(200).json(tipo);
        });
    },

    createTipo: (req, res) => {
        const tipoData = req.body; // Los datos del nuevo tipo vienen en el cuerpo de la petición
        tipoModel.createTipo(tipoData, (err, newTipoId) => {
            if (err) {
                console.error('Error al crear tipo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Tipo creado exitosamente', id: newTipoId });
        });
    },

    updateTipo: (req, res) => {
        const tipoId = req.params.id;
        const tipoData = req.body;
        tipoModel.updateTipo(tipoId, tipoData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar tipo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Tipo no encontrado o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Tipo actualizado exitosamente' });
        });
    },

    deleteTipo: (req, res) => {
        const tipoId = req.params.id;
        tipoModel.deleteTipo(tipoId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar tipo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Tipo no encontrado' });
            }
            res.status(200).json({ message: 'Tipo eliminado exitosamente' });
        });
    }
};

module.exports = tipoController;