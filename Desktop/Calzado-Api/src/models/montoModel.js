
// src/models/montoModel.js
const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const montoModel = {
    // Ejecutar un Stored Procedure para obtener todos los montos
    getAllMontos: (callback) => {
        const sql = 'CALL SP_GetMontos()'; // Llama al SP para obtener todos los montos
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_GetMontos:', err);
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para añadir un nuevo monto
    addMonto: (montoData, callback) => {
        const sql = 'CALL SP_AddMonto(?)'; // SP necesita 1 parámetro (monto_pago)
        const { monto_pago } = montoData;

        db.query(sql, [monto_pago], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_AddMonto:', err);
                return callback(err, null);
            }
            const newMontoId = results[0] && results[0][0] ? results[0][0].newMontoId : null;
            callback(null, newMontoId);
        });
    },

    // Ejecutar un Stored Procedure para obtener un monto por su ID
    getMontoById: (id_MontoPago, callback) => {
        const sql = 'CALL SP_GetMontoById(?)'; // Llama al SP para obtener un monto por ID
        db.query(sql, [id_MontoPago], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP_GetMontoById:', err);
                return callback(err, null);
            }
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar un monto existente
    updateMonto: (id_MontoPago, montoData, callback) => {
        const sql = 'CALL SP_UpdateMonto(?, ?)'; // SP necesita 2 parámetros (id_MontoPago, monto_pago)
        const { monto_pago } = montoData;

        db.query(sql, [id_MontoPago, monto_pago], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_UpdateMonto:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    },

    // Ejecutar un Stored Procedure para eliminar un monto
    deleteMonto: (id_MontoPago, callback) => {
        const sql = 'CALL SP_DeleteMonto(?)'; // Llama al SP para eliminar un monto
        db.query(sql, [id_MontoPago], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeleteMonto:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    }
};

module.exports = montoModel;
