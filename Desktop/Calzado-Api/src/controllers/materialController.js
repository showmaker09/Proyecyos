const userModel = require('../models/materialModel');

const materialController = {
    getAllMaterials: (req, res) => {
        materialModel.getAllMaterials((err, materials) => {
            if (err) {
                console.error('Error al obtener materiales:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(materials);
        });
    },

    getMaterialById: (req, res) => {
        const materialId = req.params.id;
        materialModel.getMaterialById(materialId, (err, material) => {
            if (err) {
                console.error('Error al obtener material por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!material) {
                return res.status(404).json({ message: 'Material no encontrado' });
            }
            res.status(200).json(material);
        });
    },

    createMaterial: (req, res) => {
        const materialData = req.body; // Los datos del nuevo material vienen en el cuerpo de la petición
        materialModel.createMaterial(materialData, (err, newMaterialId) => {
            if (err) {
                console.error('Error al crear material:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Material creado exitosamente', id: newMaterialId });
        });
    },

    updateMaterial: (req, res) => {
        const materialId = req.params.id;
        const materialData = req.body;
        materialModel.updateMaterial(materialId, materialData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar material:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Material no encontrado o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Material actualizado exitosamente' });
        });
    },

    deleteMaterial: (req, res) => {
        const materialId = req.params.id;
        materialModel.deleteMaterial(materialId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar material:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Material no encontrado' });
            }
            res.status(200).json({ message: 'Material eliminado exitosamente' });
        });
    }
};

module.exports = materialController;