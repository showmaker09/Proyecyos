
// src/models/reparacionModel.js
const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const reparacionModel = 
{
    // Ejecutar un Stored Procedure para obtener todas las reparaciones
    getAllReparaciones: (callback) => {
        const sql = 'CALL SP_GetReparaciones()'; // Llama al SP para obtener todas las reparaciones
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_GetReparaciones:', err);
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para añadir una nueva reparación
    createReparacion: (reparacionData, callback) => {
        const sql = 'CALL SP_AddReparacion(?, ?, ?, ?, ?)'; // SP necesita 5 parámetros
        const { Fecha_ingreso, Fecha_entrega, Observaciones, id_Servicio, id_Articulo } = reparacionData;

        db.query(sql, [Fecha_ingreso, Fecha_entrega, Observaciones, id_Servicio, id_Articulo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_AddReparacion:', err);
                return callback(err, null);
            }
            const newReparacionId = results[0] && results[0][0] ? results[0][0].newReparacionId : null;
            callback(null, newReparacionId);
        });
    },

    // Ejecutar un Stored Procedure para obtener una reparación por su ID
    getReparacionById: (id_Reparacion, callback) => {
        const sql = 'CALL SP_GetReparacionById(?)'; // Llama al SP para obtener una reparación por ID
        db.query(sql, [id_Reparacion], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP_GetReparacionById:', err);
                return callback(err, null);
            }
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar una reparación existente
    updateReparacion: (id_Reparacion, reparacionData, callback) => {
        const sql = 'CALL SP_UpdateReparacion(?, ?, ?, ?, ?)'; // SP necesita 5 parámetros
        const { Fecha_Ingreso, Fecha_entrega, Observaciones, id_Servicio, id_Articulo } = reparacionData;

        db.query(sql, [id_Reparacion, Fecha_Ingreso, Fecha_entrega, Observaciones, id_Servicio, id_Articulo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_UpdateReparacion:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    },

    // Ejecutar un Stored Procedure para eliminar una reparación
    deleteReparacion: (id_Reparacion, callback) => {
        const sql = 'CALL SP_DeleteReparacion(?)'; // Llama al SP para eliminar una reparación
        db.query(sql, [id_Reparacion], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeleteReparacion:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    }
};

module.exports = reparacionModel;
