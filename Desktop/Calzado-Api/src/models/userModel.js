
// este codigo define un modelo de usuario para interactuar con una base de datos MySQL
const db = require('../config/db');

const userModel = {
    // Ejecutar un Stored Procedure para obtener todos los usuarios
    // Asumiendo que tienes un SP llamado 'GetAllUsersSP' que no recibe parámetros
    getAllUsers: (callback) => {
        const sql = 'CALL GetAllUsersSP()'; // Sintaxis para llamar un SP
        db.query(sql, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            // Los resultados de Stored Procedures a menudo vienen en un array de arrays.
            // El primer array [0] suele contener los datos reales.
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para crear un usuario
    // Asumiendo que tienes un SP llamado 'CreateUserSP(p_nombre VARCHAR(255), p_email VARCHAR(255))'
    createUser: (userData, callback) => 
    {
        const sql = 'CALL CreateUserSP(?, ?)'; // Marcadores de posición para los parámetros
        const { nombre, email } = userData; // Asumiendo que userData tiene nombre y email

        db.query(sql, [nombre, email], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            // Si el SP devuelve el ID insertado, ajústalo.
            // Los SPs pueden tener diferentes formas de devolver resultados/confirmaciones.
            // Aquí, asumo que puede no devolver un insertId directo como una consulta INSERT.
            // Podrías necesitar un SELECT LAST_INSERT_ID() dentro del SP o que el SP lo devuelva.
            // Para este ejemplo, solo asumimos que fue exitoso si no hubo error.
            callback(null, results.affectedRows > 0 ? true : false); // O un mensaje de éxito
        });
    },

    // --- Puedes adaptar otros métodos de manera similar ---
    getUserById: (id, callback) => {
        const sql = 'CALL GetUserByIdSP(?)';
        db.query(sql, [id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result[0][0]); // Asumiendo que devuelve un solo usuario
        });
    },

    updateUser: (id, userData, callback) => {
        const sql = 'CALL UpdateUserSP(?, ?, ?)';
        const { nombre, email } = userData;
        db.query(sql, [id, nombre, email], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.affectedRows > 0 ? true : false);
        });
    },

    deleteUser: (id, callback) =>   // Ejecutar un Stored Procedure para eliminar un usuario pero con id

        {
        const sql = 'CALL DeleteUserSP(?)';
        db.query(sql, [id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.affectedRows > 0 ? true : false);
        });
    }
};


module.exports = userModel;


// este codigo define un modelo para interactuar con la tabla 'Dueño' en una base de datos MySQL
