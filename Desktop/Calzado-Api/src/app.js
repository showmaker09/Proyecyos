const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const duenoRoutes = require('./routes/duenoRoutes'); // Importa las rutas de Dueño

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Habilita el parsing de JSON en el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true })); // Habilita el parsing de URL-encoded (para formularios, si lo necesitas)

// Servir archivos estáticos del frontend (la carpeta 'public')
app.use(express.static('public'));

// Rutas de la API
app.use('/api/users', userRoutes); // Monta las rutas de usuario bajo '/api/users'
app.use('/api/duenos', duenoRoutes); // Monta las rutas de Dueño bajo '/api/duenos'

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor!', error: err.message });
});

module.exports = app;
