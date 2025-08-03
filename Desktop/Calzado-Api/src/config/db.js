require('dotenv').config(); // Carga las variables de entorno

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: '',
    port:  // Asegúrate de que el puerto sea correcto
});

connection.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos con id ' + connection.threadId);
});

module.exports = connection;
