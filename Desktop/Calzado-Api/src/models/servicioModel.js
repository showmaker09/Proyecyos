// src/models/servicioModel.js
const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const servicioModel = 
{
    // Ejecutar un Stored Procedure para obtener todos los servicios
    getAllServicios: (callback) => {
        const sql = 'CALL SP_GetServicios()'; // Llama al SP para obtener todos los servicios
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_GetServicios:', err);
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para añadir un nuevo servicio
    addServicio: (servicioData, callback) => {
        const sql = 'CALL SP_AddServicio(?, ?)'; // SP necesita 2 parámetros (Tipo, Precio)
        const { Tipo, Precio } = servicioData;

        db.query(sql, [Tipo, Precio], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_AddServicio:', err);
                return callback(err, null);
            }
            const newServicioId = results[0] && results[0][0] ? results[0][0].newServicioId : null;
            callback(null, newServicioId);
        });
    },

    // Ejecutar un Stored Procedure para obtener un servicio por su ID
    getServicioById: (id, callback) => {
        const sql = 'CALL SP_GetServicioById(?)'; // Llama al SP para obtener un servicio por ID
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP_GetServicioById:', err);
                return callback(err, null);
            }
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar un servicio existente
    updateServicio: (id, servicioData, callback) => {
        const sql = 'CALL SP_UpdateServicio(?, ?, ?)'; // SP necesita 3 parámetros (id, Tipo, Precio)
        const { Tipo, Precio } = servicioData;

        db.query(sql, [id, Tipo, Precio], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_UpdateServicio:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    },

    // Ejecutar un Stored Procedure para eliminar un servicio
    deleteServicio: (id, callback) => {
        const sql = 'CALL SP_DeleteServicio(?)'; // Llama al SP para eliminar un servicio
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeleteServicio:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    }
};

module.exports = servicioModel;
