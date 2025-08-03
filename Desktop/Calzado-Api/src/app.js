const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const duenoRoutes = require('./routes/duenoRoutes'); // Importa las rutas de Dueño
const anticipoRoutes = require('./routes/anticipoRoutes'); // Importa las rutas de Anticipo
const articuloRoutes = require('./routes/articuloRoutes'); // Importa las rutas de Articulo
const clienteRoutes = require('./routes/clienteRoutes'); // Importa las rutas de Cliente
const materialRoutes = require('./routes/materialRoutes'); // Importa las rutas de Material
const montoRoutes = require('./routes/montoRoutes'); // Importa las rutas de Monto
const pagoRoutes = require('./routes/pagoRoutes'); // Importa las rutas de Pago
const reparacionRoutes = require('./routes/reparacionRoutes'); // Importa las rutas de Reparación
const servicioRoutes = require('./routes/servicioRoutes'); // Importa las rutas de Servicio
const tipoRoutes = require('./routes/tipoRoutes'); // Importa las rutas de Tipo

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
app.use('/api/anticipos', anticipoRoutes); // Monta las rutas de Anticipo bajo '/api/anticipos'
app.use('/api/articulos', articuloRoutes); // Monta las rutas de Articulo bajo '/api/articulos'
app.use('/api/clientes', clienteRoutes); // Monta las rutas de Cliente bajo '/api/clientes'
app.use('/api/materiales', materialRoutes); // Monta las rutas de Material bajo '/api/materiales'
app.use('/api/montos', montoRoutes); // Monta las rutas de Monto bajo '/api/montos'
app.use('/api/pagos', pagoRoutes); // Monta las rutas de Pago bajo '/api/pagos'
app.use('/api/reparaciones', reparacionRoutes); // Monta las rutas de Reparación bajo '/api/reparaciones'
app.use('/api/servicios', servicioRoutes); // Monta las rutas de Servicio bajo '/api/servicios'
app.use('/api/tipos', tipoRoutes); // Monta las rutas de Tipo bajo '/api/tipos'



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
