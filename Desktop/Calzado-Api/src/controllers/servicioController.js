const servicioModel = require('../models/servicioModel');

const servicioController = {
    getAllServicios: (req, res) => {
        servicioModel.getAllServicios((err, servicios) => {
            if (err) {
                console.error('Error al obtener servicios:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(servicios);
        });
    },

    getServicioById: (req, res) => {
        const servicioId = req.params.id;
        servicioModel.getServicioById(servicioId, (err, servicio) => {
            if (err) {
                console.error('Error al obtener servicio por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!servicio) {
                return res.status(404).json({ message: 'Servicio no encontrado' });
            }
            res.status(200).json(servicio);
        });
    },

    createServicio: (req, res) => {
        const servicioData = req.body; // Los datos del nuevo servicio vienen en el cuerpo de la petición
        servicioModel.createServicio(servicioData, (err, newServicioId) => {
            if (err) {
                console.error('Error al crear servicio:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Servicio creado exitosamente', id: newServicioId });
        });
    },

    updateServicio: (req, res) => {
        const servicioId = req.params.id;
        const servicioData = req.body;
        servicioModel.updateServicio(servicioId, servicioData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar servicio:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Servicio no encontrado o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Servicio actualizado exitosamente' });
        });
    },

    deleteServicio: (req, res) => {
        const servicioId = req.params.id;
        servicioModel.deleteServicio(servicioId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar servicio:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Servicio no encontrado' });
            }
            res.status(200).json({ message: 'Servicio eliminado exitosamente' });
        });
    }
};

module.exports = servicioController;