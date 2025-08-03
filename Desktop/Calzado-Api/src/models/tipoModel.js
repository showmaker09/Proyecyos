
// src/models/tipoModel.js
const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const tipoModel = {
    // Ejecutar un Stored Procedure para obtener todos los tipos
    getAllTipos: (callback) => {
        const sql = 'CALL SP_GetTipos()'; // Llama al SP para obtener todos los tipos
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_GetTipos:', err);
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para añadir un nuevo tipo
    addTipo: (tipoData, callback) => {
        const sql = 'CALL SP_AddTipo(?)'; // SP necesita 1 parámetro (Tipo)
        const { Tipo } = tipoData;

        db.query(sql, [Tipo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_AddTipo:', err);
                return callback(err, null);
            }
            const newTipoId = results[0] && results[0][0] ? results[0][0].newTipoId : null;
            callback(null, newTipoId);
        });
    },

    // Ejecutar un Stored Procedure para obtener un tipo por su ID
    getTipoById: (id_Tipo, callback) => {
        const sql = 'CALL SP_GetTipoById(?)'; // Llama al SP para obtener un tipo por ID
        db.query(sql, [id_Tipo], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP_GetTipoById:', err);
                return callback(err, null);
            }
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar un tipo existente
    updateTipo: (id_Tipo, tipoData, callback) => {
        const sql = 'CALL SP_UpdateTipo(?, ?)'; // SP necesita 2 parámetros (id_Tipo, Tipo)
        const { Tipo } = tipoData;

        db.query(sql, [id_Tipo, Tipo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_UpdateTipo:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    },

    // Ejecutar un Stored Procedure para eliminar un tipo
    deleteTipo: (id_Tipo, callback) => {
        const sql = 'CALL SP_DeleteTipo(?)'; // Llama al SP para eliminar un tipo
        db.query(sql, [id_Tipo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeleteTipo:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    }
};

module.exports = tipoModel;
