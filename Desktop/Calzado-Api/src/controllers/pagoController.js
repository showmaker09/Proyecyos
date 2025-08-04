const pagoModel = require('../models/pagoModel');

const pagoController = 
{
    getAllPagos: (req, res) => 
    {
        pagoModel.getAllPagos((err, pagos) => 
        {
        
            if (err) {
                console.error('Error al obtener pagos:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(pagos);
        });
    },

    getPagoById: (req, res) => {
        const pagoId = req.params.id;
        pagoModel.getPagoById(pagoId, (err, pago) => {
            if (err) {
                console.error('Error al obtener pago por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!pago) {
                return res.status(404).json({ message: 'Pago no encontrado' });
            }
            res.status(200).json(pago);
        });
    },

    createPago: (req, res) => {
        const pagoData = req.body; // Los datos del nuevo pago vienen en el cuerpo de la petición
        pagoModel.createPago(pagoData, (err, newPagoId) => {
            if (err) {
                console.error('Error al crear pago:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Pago creado exitosamente', id: newPagoId });
        });
    },

    updatePago: (req, res) => {
        const pagoId = req.params.id;
        const pagoData = req.body;
        pagoModel.updatePago(pagoId, pagoData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar pago:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Pago no encontrado o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Pago actualizado exitosamente' });
        });
    },

    deletePago: (req, res) => {
        const pagoId = req.params.id;
        pagoModel.deletePago(pagoId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar pago:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Pago no encontrado' });
            }
            res.status(200).json({ message: 'Pago eliminado exitosamente' });
        });
    }
};

module.exports = pagoController;