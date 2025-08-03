
// src/models/clienteModel.js
const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const clienteModel = 
{
    // Ejecutar un Stored Procedure para obtener todos los clientes
    getAllClientes: (callback) => {
        const sql = 'CALL SP_GetClientes()'; // Llama al SP para obtener todos los clientes
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_GetClientes:', err);
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para añadir un nuevo cliente
    addCliente: (clienteData, callback) => {
        const sql = 'CALL SP_AddCliente(?, ?)'; // SP necesita 2 parámetros (Nombre, id_Anticipo)
        const { Nombre, id_Anticipo } = clienteData;

        db.query(sql, [Nombre, id_Anticipo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_AddCliente:', err);
                return callback(err, null);
            }
            const newClienteId = results[0] && results[0][0] ? results[0][0].newClienteId : null;
            callback(null, newClienteId);
        });
    },

    // Ejecutar un Stored Procedure para obtener un cliente por su ID
    getClienteById: (id_Cliente, callback) => {
        const sql = 'CALL SP_GetClienteById(?)'; // Llama al SP para obtener un cliente por ID
        db.query(sql, [id_Cliente], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP_GetClienteById:', err);
                return callback(err, null);
            }
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar un cliente existente
    updateCliente: (id_Cliente, clienteData, callback) => {
        const sql = 'CALL SP_UpdateCliente(?, ?, ?)'; // SP necesita 3 parámetros (id_Cliente, Nombre, id_Anticipo)
        const { Nombre, id_Anticipo } = clienteData;

        db.query(sql, [id_Cliente, Nombre, id_Anticipo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_UpdateCliente:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    },

    // Ejecutar un Stored Procedure para eliminar un cliente
    deleteCliente: (id_Cliente, callback) => {
        const sql = 'CALL SP_DeleteCliente(?)'; // Llama al SP para eliminar un cliente
        db.query(sql, [id_Cliente], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeleteCliente:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    }
};

module.exports = clienteModel;
