require('dotenv').config(); // Carga las variables de entorno

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'b0l5k8d6',
    database: 'california_hernandez-may',
    port: 3306 // Asegúrate de que el puerto sea correcto
});

connection.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos con id ' + connection.threadId);
});

module.exports = connection;