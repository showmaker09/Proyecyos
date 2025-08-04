// src/models/materialModel.js
const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const materialModel = 
{
    // Ejecutar un Stored Procedure para obtener todos los materiales
    getAllMateriales: (callback) => 
    {
        const sql = 'CALL SP_GetMaterials()'; // Llama al SP para obtener todos los materiales
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_GetMaterials:', err);
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },  

    // Ejecutar un Stored Procedure para añadir un nuevo material
    createMaterial: (materialData, callback) => {
        const sql = 'CALL SP_AddMaterial(?, ?)'; // SP necesita 2 parámetros (nombre, cantidad)
        const { Nombre, Cantidad } = materialData;

        db.query(sql, [Nombre, Cantidad], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_AddMaterial:', err);
                return callback(err, null);
            }
            const newMaterialId = results[0] && results[0][0] ? results[0][0].newMaterialId : null;
            callback(null, newMaterialId);
        });
    },

    // Ejecutar un Stored Procedure para obtener un material por su ID
    getMaterialById: (id_Material, callback) => {
        const sql = 'CALL SP_GetMaterialById(?)'; // Llama al SP para obtener un material por ID
        db.query(sql, [id_Material], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP_GetMaterialById:', err);
                return callback(err, null);
            }
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar un material existente
    updateMaterial: (id_Material, materialData, callback) => {
        const sql = 'CALL SP_UpdateMaterial(?, ?, ?)'; // SP necesita 3 parámetros (id_Material, nombre, cantidad)
        const { nombre, cantidad } = materialData;

        db.query(sql, [id_Material, nombre, cantidad], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_UpdateMaterial:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    },

    // Ejecutar un Stored Procedure para eliminar un material
    deleteMaterial: (id_Material, callback) => {
        const sql = 'CALL SP_DeleteMaterial(?)'; // Llama al SP para eliminar un material
        db.query(sql, [id_Material], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeleteMaterial:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    }
};

module.exports = materialModel;
