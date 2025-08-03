// src/models/articuloModel.js
const db = require('../config/db'); // Asume que 'db' es tu conexión a la base de datos

const articuloModel = 
{
    // Ejecutar un Stored Procedure para obtener todos los artículos
    getAllArticulos: (callback) => 
    {
        const sql = 'CALL SP_GetArticulos()'; // Llama al SP para obtener todos los artículos
        db.query(sql, (err, results) => 
        {
            if (err) 
            {
                console.error('Error al ejecutar SP_GetArticulos:', err);
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    // Ejecutar un Stored Procedure para añadir un nuevo artículo
    // Se corrigieron los campos para que coincidan con la función de actualización
    createArticulo: (articuloData, callback) => {
        const sql = 'CALL SP_AddArticulo(?, ?, ?)'; // SP necesita 3 parámetros
        const { id_Tipo, id_cliente, Descripcion } = articuloData; // Campos corregidos

        db.query(sql, [id_Tipo, id_cliente, Descripcion], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_AddArticulo:', err);
                return callback(err, null);
            }
            // Para una operación de INSERT, es mejor devolver el ID del nuevo registro.
            const newArticuloId = results[0] && results[0][0] ? results[0][0].newArticuloId : null;
            callback(null, newArticuloId);
        });
    },

    // Ejecutar un Stored Procedure para obtener un artículo por su ID
    getArticuloById: (id_Articulo, callback) => {
        const sql = 'CALL SP_GetArticuloById(?)'; // Llama al SP para obtener un artículo por ID
        db.query(sql, [id_Articulo], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP_GetArticuloById:', err);
                return callback(err, null);
            }
            callback(null, result[0][0]);
        });
    },

    // Ejecutar un Stored Procedure para actualizar un artículo existente
    updateArticulo: (id_Articulo, articuloData, callback) => {
        // Se corrigió el SQL para que tenga 4 placeholders
        const sql = 'CALL SP_UpdateArticulo(?, ?, ?, ?)'; 
        const { id_Tipo, id_cliente, Descripcion } = articuloData;

        db.query(sql, [id_Articulo, id_Tipo, id_cliente, Descripcion], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_UpdateArticulos:', err);
                return callback(err, null);
            }
            // Retorna el número de filas afectadas para verificar si se actualizó algo
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows)); 
        });
    },

    // Ejecutar un Stored Procedure para eliminar un artículo
    deleteArticulo: (id_Articulo, callback) => {
        const sql = 'CALL SP_DeleteArticulo(?)'; // Llama al SP para eliminar un artículo
        db.query(sql, [id_Articulo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar SP_DeleteArticulo:', err);
                return callback(err, null);
            }
            // Retorna el número de filas afectadas para verificar si se eliminó algo
            callback(null, results.affectedRows || (results[0] && results[0].affectedRows));
        });
    }
};

module.exports = articuloModel;
