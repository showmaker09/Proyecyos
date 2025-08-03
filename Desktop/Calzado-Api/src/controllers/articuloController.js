const articuloModel = require('../models/articuloModel');

const articuloController = {
    getAllArticulos: (req, res) => {
        articuloModel.getAllArticulos((err, articulos) => {
            if (err) {
                console.error('Error al obtener articulos:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(articulos);
        });
    },

    getArticuloById: (req, res) => {
        const articuloId = req.params.id;
        articuloModel.getArticuloById(articuloId, (err, articulo) => 
        {
          if (err) 
            {
               console.error('Error al obtener articulo por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
          if (!articulo)
            {
                return res.status(404).json({ message: 'Articulo no encontrado' });
            }
            res.status(200).json(articulo);
        });
    },

    createArticulo: (req, res) => 
    {
        const articuloData = req.body; // Los datos del nuevo articulo vienen en el cuerpo de la petición
        articuloModel.createArticulo(articuloData, (err, newArticuloId) => 
        {
            if (err)
            {
                console.error('Error al crear articulo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Articulo creado exitosamente', id: newArticuloId });
        });
    },

    updateArticulo: (req, res) => {
        const articuloId = req.params.id;
        const articuloData = req.body;
        articuloModel.updateArticulo(articuloId, articuloData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar articulo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Articulo no encontrado o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Articulo actualizado exitosamente' });
        });
    },

    deleteArticulo: (req, res) => {
        const articuloId = req.params.id;
        articuloModel.deleteArticulo(articuloId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar articulo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Articulo no encontrado' });
            }
            res.status(200).json({ message: 'Articulo eliminado exitosamente' });
        });
    }
};

module.exports = articuloController;