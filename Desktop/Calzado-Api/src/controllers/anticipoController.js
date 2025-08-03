
const anticipoModel = require('../models/anticipoModel');
const anticipoController = {
    getAllAnticipos: (req, res) => {
        anticipoModel.getAllAnticipos((err, anticipos) => {
            if (err) {
                console.error('Error al obtener anticipos:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(anticipos);
        });
    },

    getAnticipoById: (req, res) => {
        const anticipoId = req.params.id;
        anticipoModel.getAnticipoById(anticipoId, (err, anticipo) => {
            if (err) {
                console.error('Error al obtener anticipo por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!anticipo) {
                return res.status(404).json({ message: 'Anticipo no encontrado' });
            }
            res.status(200).json(anticipo);
        });
    },

    createAnticipo: (req, res) => {
        const anticipoData = req.body;
        anticipoModel.createAnticipo(anticipoData, (err, newAnticipoId) => {
            if (err) {
                console.error('Error al crear anticipo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Anticipo creado exitosamente', id: newAnticipoId });
        });
    },

    updateAnticipo: (req, res) => {
        const anticipoId = req.params.id;
        const anticipoData = req.body;
        anticipoModel.updateAnticipo(anticipoId, anticipoData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar anticipo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Anticipo no encontrado o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Anticipo actualizado exitosamente' });
        });
    },

    deleteAnticipo: (req, res) => {
        const anticipoId = req.params.id;
        anticipoModel.deleteAnticipo(anticipoId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar anticipo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Anticipo no encontrado' });
            }
            res.status(200).json({ message: 'Anticipo eliminado exitosamente' });
        });
    }
};

module.exports = anticipoController;

  