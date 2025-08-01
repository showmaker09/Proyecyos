const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const duenoModel = {
    // Ejecutar un Stored Procedure para obtener todos los dueños
    getAllDuenos: (callback) => {
        const sql = 'CALL SP_GetDueños()'; // Llama al SP para obtener todos los dueños
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_GetDueños:', err);
                return callback(err, null);
            }
            // Los resultados de Stored Procedures a menudo vienen en un array de arrays.
            // El primer array [0] suele contener los datos reales.
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para añadir un nuevo dueño
    addDueno: (duenoData, callback) => {   
        const sql = 'CALL SP_AddDueño(?, ?)'; // Llama al SP para añadir un dueño
        const { Nombre, Ganancia } = duenoData; // Asumiendo que duenoData tiene Nombre y Ganancia

        db.query(sql, [Nombre, Ganancia], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_AddDueño:', err);
                return callback(err, null);
            }
            // Para operaciones de INSERT/UPDATE/DELETE con SPs,
            // a menudo se verifica affectedRows para confirmar el éxito.
            callback(null, results.affectedRows > 0); // Devuelve true si se afectó al menos una fila
        });
    },

    // Ejecutar un Stored Procedure para obtener un dueño por su ID
    getDuenoById: (id, callback) => {
        const sql = 'CALL SP_GetDueñoById(?)'; // Llama al SP para obtener un dueño por ID
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP_GetDueñoById:', err);
                return callback(err, null);
            }
            // Asumiendo que el SP devuelve un solo registro, este estará en results[0][0]
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar un dueño existente
    updateDueno: (id, duenoData, callback) => {
        const sql = 'CALL SP_UpdateDueño(?, ?, ?)'; // Llama al SP para actualizar un dueño
        const { Nombre, Ganancia } = duenoData; // Asumiendo que duenoData tiene Nombre y Ganancia

        db.query(sql, [id, Nombre, Ganancia], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_UpdateDueño:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows > 0); // Devuelve true si se afectó al menos una fila
        });
    },

    // Ejecutar un Stored Procedure para eliminar un dueño
    deleteDueno: (id, callback) => {
        const sql = 'CALL SP_DeleteDueño(?)'; // Llama al SP para eliminar un dueño
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeleteDueño:', err);
                return callback(err, null);
            }
            callback(null, results.affectedRows > 0); // Devuelve true si se afectó al menos una fila
        });
    }
};

module.exports = duenoModel;
