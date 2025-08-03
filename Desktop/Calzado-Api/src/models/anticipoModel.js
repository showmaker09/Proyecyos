
// src/models/anticipoModel.js
const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const anticipoModel = 
{
    // Ejecutar un Stored Procedure para obtener todos los anticipos
    getAllAnticipos: (callback) => {
        const sql = 'CALL SP_GetAnticipos()'; // Llama al SP para obtener todos los anticipos
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_GetAnticipos:', err);
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para añadir un nuevo anticipo
    // cambiar a  createAnticipo
    createAnticipo: (anticipoData, callback) => {
        const sql = 'CALL SP_AddAnticipo(?)'; // SP necesita 1 parámetro (Anticipo)
        const { Anticipo } = anticipoData;

        db.query(sql, [Anticipo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_AddAnticipo:', err);
                return callback(err, null);
            }
            const newAnticipoId = results[0] && results[0][0] ? results[0][0].newAnticipoId : null;
            callback(null, newAnticipoId);
        });
    },

    // Ejecutar un Stored Procedure para obtener un anticipo por su ID
    getAnticipoById: (id_anticipo, callback) => {
        const sql = 'CALL SP_GetAnticipoById(?)'; // Llama al SP para obtener un anticipo por ID
        db.query(sql, [id_anticipo], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP_GetAnticipoById:', err);
                return callback(err, null);
            }
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar un anticipo existente
    updateAnticipo: (id_anticipo, anticipoData, callback) => {
        const sql = 'CALL SP_UpdateAnticipo(?, ?)'; // SP necesita 2 parámetros (id_anticipo, Anticipo)
        const { Anticipo } = anticipoData;

        db.query(sql, [id_anticipo, Anticipo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_UpdateAnticipo:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    },

    // Ejecutar un Stored Procedure para eliminar un anticipo
    deleteAnticipo: (id_anticipo, callback) => {
        const sql = 'CALL SP_DeleteAnticipo(?)'; // Llama al SP para eliminar un anticipo
        db.query(sql, [id_anticipo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeleteAnticipo:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    }
};

module.exports = anticipoModel;
