
// src/models/pagoModel.js
const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const pagoModel = 
{
    // Ejecutar un Stored Procedure para obtener todos los pagos
    getAllPagos: (callback) => {
        const sql = 'CALL SP_GetPagos()'; // Llama al SP para obtener todos los pagos
        db.query(sql, (err, results) => 
        {
            if (err) {
                console.error('Error al ejecutar SP_GetPagos:', err);
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para añadir un nuevo pago
    addPago: (pagoData, callback) => 
    {
        const sql = 'CALL SP_AddPago(?, ?, ?, ?)'; // SP necesita 4 parámetros
        const { id_Reparacion, id_Cliente, Fecha_Pago, id_Monto } = pagoData;

        db.query(sql, [id_Reparacion, id_Cliente, Fecha_Pago, id_Monto], (err, results) => 
        {
            if (err) {
                console.error('Error al ejecutar SP_AddPago:', err);
                return callback(err, null);
            }
            const newPagoId = results[0] && results[0][0] ? results[0][0].newPagoId : null;
            callback(null, newPagoId);
        });
    },

    // Ejecutar un Stored Procedure para obtener un pago por su ID
    getPagoById: (id_Pago, callback) => {
        const sql = 'CALL SP_GetPagoById(?)'; // Llama al SP para obtener un pago por ID
        db.query(sql, [id_Pago], (err, result) => 
        {
            if (err) {
                console.error('Error al ejecutar SP_GetPagoById:', err);
                return callback(err, null);
            }
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar un pago existente
    updatePago: (id_Pago, pagoData, callback) => {
        const sql = 'CALL SP_UpdatePago(?, ?, ?, ?, ?)'; // SP necesita 5 parámetros
        const { id_Reparacion, id_Cliente, Fecha_Pago, id_Monto } = pagoData;

        db.query(sql, [id_Pago, id_Reparacion, id_Cliente, Fecha_Pago, id_Monto], (err, results) => 
        {
            if (err) {
                console.error('Error al ejecutar SP_UpdatePago:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    },

    // Ejecutar un Stored Procedure para eliminar un pago
    deletePago: (id_Pago, callback) => {
        const sql = 'CALL SP_DeletePago(?)'; // Llama al SP para eliminar un pago
        db.query(sql, [id_Pago], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeletePago:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    }
};

module.exports = pagoModel;
